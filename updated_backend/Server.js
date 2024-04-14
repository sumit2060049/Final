const express = require('express');
const bodyParser = require('body-parser');
const appRoutes = require('./routes');
const mysql = require('mysql2');
const EmailService = require('./emailService');
const usersTable = require('./models').User;
const Subrole = require('./models').Subrole;
const TrainingCategory = require('./models').TrainingCategory;
const TrainingPlan = require('./models').TrainingPlan;
const TrainingModule = require('./models').TrainingModule;
const TrainingAmount = require('./models').TrainingAmount;
const TrainingAssessment = require('./models').TrainingAssessment;
const UserTrainingProgress = require('./models').UserTrainingProgress;
const { Op } = require('sequelize');

const Report = require('./models').Report;
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

dotenv.config({ path: './config/config.env' });

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect(function (err) {
  if (err) throw err;
  console.log('Connected!');
});

const PORT = process.env.PORT || 8087;

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use('/', appRoutes);

app.post('/forgot-password', async (req, res) => {
  const { forgotemail } = req.body;
  const email = forgotemail;

  try {
    const user = await usersTable.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a random password
    const randomPassword = Math.random().toString(36).slice(-8);

    // Update user's password
    await user.update({ Password: randomPassword, IsChanged: 0 });
    await EmailService.sendEmail(
      req.body.forgotemail,
      'Please change your password',
      `Credential to login only for the first time Email:${req.body.forgotemail} password:${randomPassword}`
    );

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    return res
      .status(500)
      .json({ message: 'An error occurred while updating password' });
  }
});

// routes.js
app.get('/subroles', async (req, res) => {
  try {
    const subroles = await Subrole.findAll();
    console.log(subroles);
    res.json(subroles);
  } catch (error) {
    console.error('Error fetching subroles:', error);
    res
      .status(500)
      .json({ message: 'An error occurred while fetching subroles' });
  }
});

// routes.js
app.get('/users', async (req, res) => {
  try {
    const users = await usersTable.findAll();
    console.log(users);
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'An error occurred while fetching users' });
  }
});

// routes.js
app.get('/training-categories', async (req, res) => {
  try {
    const categories = await TrainingCategory.findAll();
    console.log(categories);
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res
      .status(500)
      .json({ message: 'An error occurred while fetching categories' });
  }
});

// routes.js
app.get('/training-plans', async (req, res) => {
  try {
    const plans = await TrainingPlan.findAll();
    console.log(plans);
    res.json(plans);
  } catch (error) {
    console.error('Error fetching training plans:', error);
    res
      .status(500)
      .json({ message: 'An error occurred while fetching training plans' });
  }
});

app.get('/training-plan', async (req, res) => {
  try {
    const userSubroleID = req.query.subroleID;
    const plans = await TrainingPlan.findAll({
      where: { SubroleID: userSubroleID },
    });
    console.log(plans);
    res.json(plans);
  } catch (error) {
    console.error('Error fetching training plans:', error);
    res
      .status(500)
      .json({ message: 'An error occurred while fetching training plans' });
  }
});

// routes.js
app.get('/training-modules', async (req, res) => {
  try {
    const modules = await TrainingModule.findAll();
    res.json(modules);
  } catch (error) {
    console.error('Error fetching training modules:', error);
    res
      .status(500)
      .json({ message: 'An error occurred while fetching training modules' });
  }
});

app.get('/training-module', async (req, res) => {
  try {
    const plansid = req.query.plansid;
    const modules = await TrainingModule.findAll({
      where: { PlanID: plansid },
    });
    res.json(modules);
  } catch (error) {
    console.error('Error fetching training modules:', error);
    res
      .status(500)
      .json({ message: 'An error occurred while fetching training modules' });
  }
});

// routes.js
app.get('/training-amounts', async (req, res) => {
  try {
    const amounts = await TrainingAmount.findAll();
    console.log(amounts);
    res.json(amounts);
  } catch (error) {
    console.error('Error fetching training amounts:', error);
    res
      .status(500)
      .json({ message: 'An error occurred while fetching training amounts' });
  }
});

// routes.js
app.get('/assessment-marks', async (req, res) => {
  try {
    const marks = await TrainingAssessment.findAll();
    res.json(marks);
  } catch (error) {
    console.error('Error fetching assessment marks:', error);
    res
      .status(500)
      .json({ message: 'An error occurred while fetching assessment marks' });
  }
});

app.get('/marks', async (req, res) => {
  try {
    const { userID, moduleID } = req.query;
    const marks = await TrainingAssessment.findAll({
      where: { UserID: userID, ModuleID: moduleID },
    });
    res.json(marks);
  } catch (error) {
    console.error('Error fetching marks:', error);
    res.status(500).json({ message: 'An error occurred while fetching marks' });
  }
});

app.get('/reports', async (req, res) => {
  try {
    const { userID, moduleID } = req.query;
    const reports = await Report.findAll({
      where: { UserID: userID, ModuleID: moduleID },
    });
    res.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res
      .status(500)
      .json({ message: 'An error occurred while fetching reports' });
  }
});
app.get('/getuser-report', async (req, res) => {
  try {
    const report = await Report.findAll();
    res.json(report);
  } catch (error) {
    console.error('Error fetching report:', error);
    res
      .status(500)
      .json({ message: 'An error occurred while fetching report' });
  }
});

// Endpoint to fetch marks for a specific user and module
app.get('/marks', async (req, res) => {
  const { userId, moduleId } = req.query;
  const marks = await TrainingAssessment.findOne({
    where: { UserID: userId, ModuleID: moduleId },
  });
  if (!marks) {
    return res
      .status(404)
      .json({ message: 'Marks not found for the specified user and module' });
  }
  console.log(marks);
  res.json(marks);
});

app.get('/plans-detail/:planID', async (req, res) => {
  const planID = req.params.planID;

  try {
    const plan = await TrainingPlan.findOne({ where: { PlanID: planID } });

    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    res.json(plan);
  } catch (error) {
    console.error('Error fetching plan details:', error);
    res.status(500).json({ message: 'Failed to fetch plan details' });
  }
});

app.post('/api/authenticate', async (req, res) => {
  const { email, password } = req.body;
  const query = `SELECT * FROM users WHERE email = '${email}'`;
  console.log(req.body);

  connection.query(query, async (error, results, fields) => {
    if (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
    const user = results[0];
    console.log(user);
    console.log(password);
    // console.log(user.Password)
    if (!user || !(await bcrypt.compare(password, user.Password))) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res
      .status(200)
      .json({ message: 'Authentication successful', token, user });
  });
});

//update password

app.post('/update-password', async (req, res) => {
  const { Email, newPassword } = req.body;

  //check if the password is same as old
  const user = await usersTable.findOne({ where: { Email } });
  console.log(user);
  console.log(Email);
  console.log(newPassword);

  if (!user) {
    return res.status(404).json({ status: false, message: 'User not found' });
  }

  const isPasswordMatch = await bcrypt.compare(newPassword, user.Password);
  if (isPasswordMatch) {
    return res.status(200).json({
      status: false,
      message: 'New password must be different from old password',
    });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await user.update({ Password: hashedPassword, IsChanged: 1 });

  return res
    .status(200)
    .json({ status: true, message: 'Password updated successfully' });
});

app.post('/add-trainingcategory', async (req, res) => {
  try {
    const { categoryName, categoryExplain } = req.body;

    // Check if the category name already exists
    const existingCategory = await TrainingCategory.findOne({
      where: { CategoryName: categoryName },
    });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    await TrainingCategory.create({
      CategoryName: categoryName,
      CategoryExplain: categoryExplain,
    });
    res.sendStatus(201);
  } catch (error) {
    console.error('Error adding category:', error);
    res.sendStatus(500);
  }
});

app.post('/add-trainingplan', async (req, res) => {
  try {
    const { planName, description, startDate, endDate, subroleID, categoryID } =
      req.body;
    const existingPlan = await TrainingPlan.findOne({
      where: { PlanName: planName },
    });
    if (existingPlan) {
      return res
        .status(400)
        .json({ message: 'Plan already exists with this plan name' });
    }

    // Check if any existing plan overlaps with the new plan's dates
    const existingPlans = await TrainingPlan.findAll({
      where: {
        [Op.or]: [
          {
            StartDate: { [Op.between]: [startDate, endDate] },
          },
          {
            EndDate: { [Op.between]: [startDate, endDate] },
          },
          {
            [Op.and]: [
              { StartDate: { [Op.lte]: startDate } },
              { EndDate: { [Op.gte]: endDate } },
            ],
          },
          {
            [Op.and]: [
              { StartDate: { [Op.gte]: startDate } },
              { EndDate: { [Op.lte]: endDate } },
            ],
          },
        ],
        SubroleID: subroleID,
      },
    });

    if (existingPlans.length > 0) {
      return res
        .status(400)
        .json({ message: 'Plan overlaps with existing plan' });
    }

    await TrainingPlan.create({
      PlanName: planName,
      Description: description,
      StartDate: startDate,
      EndDate: endDate,
      SubroleID: subroleID,
      CategoryID: categoryID,
    });
    res.sendStatus(201);
  } catch (error) {
    console.error('Error adding plan:', error);
    res.sendStatus(500);
  }
});

app.post('/add-trainingmodule', async (req, res) => {
  try {
    const { moduleName, description, planID, moduleDate, startTime, endTime } =
      req.body;
    const existingModule = await TrainingModule.findOne({
      where: { ModuleName: moduleName },
    });
    if (existingModule) {
      return res.status(400).json({ message: 'Module already exists' });
    }
    console.log(moduleDate);
    const existingModuleDate = await TrainingModule.findOne({
      where: {
        ModuleDate:
          // moduleDate
          {
            [Op.between]: [
              new Date(`${moduleDate}T00:00:00.000Z`),
              new Date(`${moduleDate}T23:59:59.999Z`),
            ],
          },
      },
    });
    if (existingModuleDate) {
      console.log('bro');
      return res.status(400).json({ message: 'Day is already booked' });
    }

    await TrainingModule.create({
      ModuleName: moduleName,
      Description: description,
      PlanID: planID,
      ModuleDate: moduleDate,
      StartTime: startTime,
      EndTime: endTime,
    });
    res.sendStatus(201);
  } catch (error) {
    console.error('Error adding module:', error);
    res.sendStatus(500);
  }
});

app.post('/add-moduleamount', async (req, res) => {
  try {
    const { moduleID, amount, currency } = req.body;

    const existingModule = await TrainingAmount.findOne({
      where: { ModuleID: moduleID },
    });
    if (existingModule) {
      return res
        .status(400)
        .json({ message: 'Amount for this Module already added' });
    }

    await TrainingAmount.create({
      ModuleID: moduleID,
      Amount: amount,
      Currency: currency,
    });
    res.sendStatus(201);
  } catch (error) {
    console.error('Error adding amount:', error);
    res.sendStatus(500);
  }
});

app.post('/add-assesmentmark', async (req, res) => {
  try {
    const { userID, moduleID, score, dateCompleted } = req.body;

    const existingMarks = await TrainingAssessment.findOne({
      where: { UserID: userID, ModuleID: moduleID },
    });

    if (existingMarks) {
      return res
        .status(400)
        .json({ message: 'Marks already added for this module' });
    }

    await TrainingAssessment.create({
      UserID: userID,
      ModuleID: moduleID,
      Score: score,
      DateCompleted: dateCompleted,
    });
    res.sendStatus(201);
  } catch (error) {
    console.error('Error adding assessment:', error);
    res.sendStatus(500);
  }
});

app.post('/user-progress', async (req, res) => {
  try {
    const { userID, moduleID, completionStatus, dateCompleted } = req.body;
    // Check if the UserID and ModuleID combination already exists
    const existingProgress = await UserTrainingProgress.findOne({
      where: { UserID: userID, ModuleID: moduleID },
    });

    if (existingProgress) {
      return res
        .status(400)
        .json({ message: 'Progress already added for this module' });
    }
    await UserTrainingProgress.create({
      UserID: userID,
      ModuleID: moduleID,
      CompletionStatus: completionStatus,
      DateCompleted: dateCompleted,
    });
    res.sendStatus(201);
  } catch (error) {
    console.error('Error adding progress:', error);
    res.sendStatus(500);
  }
});

app.post('/user-report', async (req, res) => {
  try {
    const { userID, moduleID, reportDate, summary, recommendations } = req.body;
    // Check if the UserID and ModuleID combination already exists
    const existingReport = await Report.findOne({
      where: { UserID: userID, ModuleID: moduleID },
    });

    if (existingReport) {
      return res.status(400).json({
        message: 'Report already added for this module for this user',
      });
    }
    await Report.create({
      UserID: userID,
      ModuleID: moduleID,
      ReportDate: reportDate,
      Summary: summary,
      Recommendations: recommendations,
    });
    res.sendStatus(201);
  } catch (error) {
    console.error('Error adding report:', error);
    res.sendStatus(500);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT} `);
});
