const prisma = require('../config/db');
const { getStepsForRole } = require('../config/onboardingSteps');

// Builds the full onboarding picture for one user:
// the step list from the config file + the progress saved in the database.
const buildOnboarding = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true, onboardingStatus: true },
  });

  if (!user) {
    return null;
  }

  const savedSteps = await prisma.onboardingStep.findMany({
    where: { userId },
  });

  const savedByKey = {};
  savedSteps.forEach((saved) => {
    savedByKey[saved.stepName] = saved;
  });

  const steps = getStepsForRole(user.role).map((step) => {
    const saved = savedByKey[step.key];
    return {
      ...step,
      status: saved ? saved.status : 'PENDING',
      completedAt: saved ? saved.completedAt : null,
    };
  });

  const completedCount = steps.filter((s) => s.status === 'COMPLETED').length;

  return {
    onboardingStatus: user.onboardingStatus,
    steps,
    completedCount,
    totalCount: steps.length,
  };
};

// GET /api/onboarding
const getOnboarding = async (req, res) => {
  try {
    const data = await buildOnboarding(req.user.id);

    if (!data) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(data);
  } catch (error) {
    console.error('Get onboarding error:', error.message);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const VALID_STATUSES = ['IN_PROGRESS', 'COMPLETED'];
const LOCKED_STATUSES = ['SUBMITTED', 'APPROVED', 'REJECTED'];

// PUT /api/onboarding/steps/:stepKey
const updateStep = async (req, res) => {
  try {
    const userId = req.user.id;
    const { stepKey } = req.params;
    const { status } = req.body || {};

    // 1. Check the status value that was sent
    if (!VALID_STATUSES.includes(status)) {
      return res
        .status(400)
        .json({ message: 'Status must be IN_PROGRESS or COMPLETED' });
    }

    // 2. Find the user and check that the step exists for their role
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, onboardingStatus: true },
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const allSteps = getStepsForRole(user.role);
    const stepIndex = allSteps.findIndex((s) => s.key === stepKey);
    if (stepIndex === -1) {
      return res.status(404).json({ message: 'Step not found' });
    }

    // 3. No changes after the application is submitted
    if (LOCKED_STATUSES.includes(user.onboardingStatus)) {
      return res
        .status(400)
        .json({ message: 'Onboarding is already submitted' });
    }

    // 4. Steps must be done in order
    const savedSteps = await prisma.onboardingStep.findMany({
      where: { userId },
    });
    const completedKeys = savedSteps
      .filter((s) => s.status === 'COMPLETED')
      .map((s) => s.stepName);

    const previousKeys = allSteps.slice(0, stepIndex).map((s) => s.key);
    const previousDone = previousKeys.every((k) => completedKeys.includes(k));
    if (!previousDone) {
      return res
        .status(400)
        .json({ message: 'Complete the previous steps first' });
    }

    if (completedKeys.includes(stepKey) && status === 'IN_PROGRESS') {
      return res
        .status(400)
        .json({ message: 'A completed step cannot be reopened' });
    }

    // 5. Save the step (insert it the first time, update it after that)
    await prisma.onboardingStep.upsert({
      where: { userId_stepName: { userId, stepName: stepKey } },
      update: {
        status,
        completedAt: status === 'COMPLETED' ? new Date() : null,
      },
      create: {
        userId,
        stepName: stepKey,
        status,
        completedAt: status === 'COMPLETED' ? new Date() : null,
      },
    });

    // 6. Update the overall onboarding status of the user
    const updatedSteps = await prisma.onboardingStep.findMany({
      where: { userId },
    });
    const completedCount = updatedSteps.filter(
      (s) => s.status === 'COMPLETED'
    ).length;

    let overallStatus = 'NOT_STARTED';
    if (completedCount === allSteps.length) {
      overallStatus = 'SUBMITTED';
    } else if (updatedSteps.length > 0) {
      overallStatus = 'IN_PROGRESS';
    }

    await prisma.user.update({
      where: { id: userId },
      data: { onboardingStatus: overallStatus },
    });

    // 7. Send back the fresh picture
    const data = await buildOnboarding(userId);
    res.json({ message: 'Step updated', ...data });
  } catch (error) {
    console.error('Update step error:', error.message);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

module.exports = { getOnboarding, buildOnboarding, updateStep };