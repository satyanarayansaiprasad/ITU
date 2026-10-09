const InstructorRefereeRegistration = require('../models/InstructorRefereeRegistration');
const { sendEmail, getEmailFrom } = require('../config/email');
let ExcelJS;
try {
  ExcelJS = require('exceljs');
} catch (e) {
  console.warn('exceljs package not loaded for instructor referee controller');
}

// Helper: Calculate age from DOB
const calculateAge = (dobString) => {
  const dob = new Date(dobString);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
};

// Helper: Generate Unique Registration Number
const generateRegistrationNo = async () => {
  const prefix = 'ITU-NIRC-2026-';
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  const timestamp = Date.now().toString().slice(-4);
  const registrationNo = `${prefix}${timestamp}${randomDigits}`;
  
  // Check uniqueness
  const existing = await InstructorRefereeRegistration.findOne({ registrationNo });
  if (existing) {
    return generateRegistrationNo();
  }
  return registrationNo;
};

// Submit registration
exports.submitRegistration = async (req, res) => {
  try {
    const {
      fullName,
      fatherMotherName,
      dob,
      gender,
      nationality = 'Indian',
      mobileNumber,
      email,
      address,
      state,
      pinCode,
      presentDan,
      danCertificateNo,
      dateOfDanCertification,
      isAwaitingDanCertificate,
      academyName,
      yearsExperience,
      currentDesignation,
      courseOption,
      previousCourseAttended,
      previousCourseDetails,
      previousGrade,
      transactionId
    } = req.body;

    // Validate required personal fields
    if (!fullName || !fatherMotherName || !dob || !gender || !mobileNumber || !email || !address || !state || !pinCode) {
      return res.status(400).json({
        success: false,
        error: 'Please fill in all required personal details.'
      });
    }

    // Validate Age >= 17
    const age = calculateAge(dob);
    if (isNaN(age) || age < 17) {
      return res.status(400).json({
        success: false,
        error: 'Candidates must be 17 years of age or above to be eligible for this course.'
      });
    }

    // Validate Mobile Number
    const cleanMobile = mobileNumber.replace(/\D/g, '');
    if (cleanMobile.length < 10) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid 10-digit mobile number.'
      });
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid email address.'
      });
    }

    // Validate Taekwondo details
    if (!presentDan || !academyName || yearsExperience === undefined || !currentDesignation) {
      return res.status(400).json({
        success: false,
        error: 'Please fill in all required Taekwondo details.'
      });
    }

    const awaitingDan = isAwaitingDanCertificate === 'true' || isAwaitingDanCertificate === true;
    if (!awaitingDan && !danCertificateNo) {
      return res.status(400).json({
        success: false,
        error: 'Dan Certificate Number is required unless awaiting Dan certificate.'
      });
    }

    // Validate Course Option and compute Fee & Selected Courses
    if (!['instructor', 'referee', 'both'].includes(courseOption)) {
      return res.status(400).json({
        success: false,
        error: 'Please select a valid course registration option.'
      });
    }

    let feeAmount = 0;
    let selectedCourses = [];

    if (courseOption === 'instructor') {
      feeAmount = 3000;
      selectedCourses = ['National Instructor Training Course'];
    } else if (courseOption === 'referee') {
      feeAmount = 3000;
      selectedCourses = ['National Referee Training Course'];
    } else if (courseOption === 'both') {
      feeAmount = 5000;
      selectedCourses = ['National Instructor Training Course', 'National Referee Training Course'];
    }

    // Validate Transaction ID
    if (!transactionId || transactionId.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Transaction Reference ID / UTR is required.'
      });
    }

    // Handle File Uploads
    let photoPath = null;
    let paymentProofPath = null;

    if (req.files) {
      if (req.files.photo && req.files.photo[0]) {
        photoPath = req.files.photo[0].path || req.files.photo[0].filename;
      }
      if (req.files.paymentProof && req.files.paymentProof[0]) {
        paymentProofPath = req.files.paymentProof[0].path || req.files.paymentProof[0].filename;
      }
    }

    // Generate unique Registration Number
    const registrationNo = await generateRegistrationNo();

    // Create Registration Record
    const registration = new InstructorRefereeRegistration({
      registrationNo,
      fullName: fullName.trim(),
      fatherMotherName: fatherMotherName.trim(),
      dob: new Date(dob),
      gender,
      nationality: nationality.trim(),
      mobileNumber: cleanMobile,
      email: email.trim().toLowerCase(),
      address: address.trim(),
      state: state.trim(),
      pinCode: pinCode.trim(),
      photo: photoPath,
      presentDan: presentDan.trim(),
      danCertificateNo: danCertificateNo ? danCertificateNo.trim() : '',
      dateOfDanCertification: dateOfDanCertification ? new Date(dateOfDanCertification) : null,
      isAwaitingDanCertificate: awaitingDan,
      academyName: academyName.trim(),
      yearsExperience: Number(yearsExperience),
      currentDesignation: currentDesignation.trim(),
      courseOption,
      selectedCourses,
      feeAmount,
      previousCourseAttended: previousCourseAttended === 'true' || previousCourseAttended === true,
      previousCourseDetails: previousCourseDetails ? previousCourseDetails.trim() : '',
      previousGrade: previousGrade ? previousGrade.trim() : '',
      transactionId: transactionId.trim(),
      paymentProof: paymentProofPath,
      paymentStatus: 'pending',
      status: 'submitted'
    });

    await registration.save();

    // Send confirmation email asynchronously
    try {
      const formattedFee = `₹${feeAmount.toLocaleString('en-IN')}`;
      const mailOptions = {
        from: getEmailFrom(),
        to: email.trim().toLowerCase(),
        subject: `Registration Confirmation - National Instructor & Referee Course 2026 (${registrationNo})`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; rounded: 8px;">
            <div style="background-color: #0E2A4E; padding: 20px; text-align: center; color: #ffffff; border-radius: 6px 6px 0 0;">
              <h1 style="margin: 0; font-size: 22px;">Indian Taekwondo Union (ITU)</h1>
              <p style="margin: 5px 0 0; font-size: 14px;">National Instructor & Referee Training Course 2026</p>
            </div>
            <div style="padding: 20px; background-color: #ffffff;">
              <h2 style="color: #0E2A4E; font-size: 18px; margin-top: 0;">Dear ${fullName},</h2>
              <p>Thank you for registering for the <strong>National Instructor & Referee Training Course 2026</strong>. Your registration has been submitted successfully.</p>
              
              <div style="background-color: #f8fafc; padding: 15px; border-left: 4px solid #2563eb; margin: 20px 0; border-radius: 4px;">
                <p style="margin: 3px 0;"><strong>Registration Number:</strong> <span style="color: #2563eb; font-weight: bold; font-family: monospace;">${registrationNo}</span></p>
                <p style="margin: 3px 0;"><strong>Course Selected:</strong> ${selectedCourses.join(' & ')}</p>
                <p style="margin: 3px 0;"><strong>Fee Amount:</strong> ${formattedFee}</p>
                <p style="margin: 3px 0;"><strong>Transaction Ref / UTR:</strong> ${transactionId}</p>
                <p style="margin: 3px 0;"><strong>Payment Status:</strong> Pending Verification</p>
              </div>

              <h3 style="color: #0E2A4E; font-size: 16px; margin-bottom: 8px;">Event Details:</h3>
              <ul style="padding-left: 20px; color: #334155; line-height: 1.6;">
                <li><strong>Dates:</strong> 30th, 31st October & 1st November 2026</li>
                <li><strong>Reporting Time:</strong> 30th October 2026 at 8:00 AM</li>
                <li><strong>Venue:</strong> Madhusudan Bhawan, Chhend, Rourkela, Odisha</li>
                <li><strong>Organized by:</strong> Odisha Taekwondo Union (Promoted by ITU)</li>
              </ul>

              <h3 style="color: #0E2A4E; font-size: 16px; margin-bottom: 8px;">Important Checklist for Reporting:</h3>
              <ol style="padding-left: 20px; color: #334155; line-height: 1.6;">
                <li>Taekwondo uniform is compulsory throughout the training programme.</li>
                <li>Submit two (2) copies of recent stamp-size colour photographs at registration reporting.</li>
                <li>Participants must arrange their own accommodation and food.</li>
              </ol>

              <p style="margin-top: 25px; font-size: 13px; color: #64748b;">For any queries, contact ITU at 9583921122 / 9438849523 or email indianteakwondounion@gmail.com.</p>
            </div>
          </div>
        `
      };
      sendEmail(mailOptions).catch(err => console.error('Email dispatch error:', err));
    } catch (emailErr) {
      console.error('Failed to trigger confirmation email:', emailErr);
    }

    res.status(201).json({
      success: true,
      message: 'Registration submitted successfully',
      data: registration
    });
  } catch (error) {
    console.error('Error in submitRegistration:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to process course registration'
    });
  }
};

// Admin: Get All Registrations
exports.getRegistrations = async (req, res) => {
  try {
    const {
      search = '',
      courseOption = '',
      paymentStatus = '',
      status = '',
      page = 1,
      limit = 20
    } = req.query;

    const query = {};

    if (courseOption) {
      query.courseOption = courseOption;
    }
    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }
    if (status) {
      query.status = status;
    }

    if (search) {
      const searchRegex = { $regex: search.trim(), $options: 'i' };
      query.$or = [
        { fullName: searchRegex },
        { registrationNo: searchRegex },
        { mobileNumber: searchRegex },
        { email: searchRegex },
        { transactionId: searchRegex },
        { state: searchRegex },
        { academyName: searchRegex }
      ];
    }

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 20;
    const skip = (pageNum - 1) * limitNum;

    const total = await InstructorRefereeRegistration.countDocuments(query);
    const registrations = await InstructorRefereeRegistration.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    // Compute metrics totals
    const totalVerifiedCount = await InstructorRefereeRegistration.countDocuments({ paymentStatus: 'verified' });
    const verifiedFeeSum = await InstructorRefereeRegistration.aggregate([
      { $match: { paymentStatus: 'verified' } },
      { $group: { _id: null, total: { $sum: '$feeAmount' } } }
    ]);
    const totalRevenue = verifiedFeeSum[0]?.total || 0;

    res.status(200).json({
      success: true,
      data: registrations,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalRegistrations: total,
        limit: limitNum
      },
      summary: {
        totalVerifiedCount,
        totalRevenue
      }
    });
  } catch (error) {
    console.error('Error fetching course registrations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch registrations'
    });
  }
};

// Admin: Update Payment / Registration Status
exports.updateRegistrationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus, status, adminNotes } = req.body;

    const registration = await InstructorRefereeRegistration.findById(id);
    if (!registration) {
      return res.status(404).json({
        success: false,
        error: 'Registration record not found'
      });
    }

    if (paymentStatus) {
      registration.paymentStatus = paymentStatus;
      if (paymentStatus === 'verified') {
        registration.status = 'approved';
      } else if (paymentStatus === 'rejected') {
        registration.status = 'rejected';
      }
    }

    if (status) {
      registration.status = status;
    }

    if (adminNotes !== undefined) {
      registration.adminNotes = adminNotes;
    }

    await registration.save();

    res.status(200).json({
      success: true,
      message: 'Registration status updated successfully',
      data: registration
    });
  } catch (error) {
    console.error('Error updating registration status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update registration status'
    });
  }
};

// Admin: Download Excel
exports.downloadExcel = async (req, res) => {
  try {
    if (!ExcelJS) {
      return res.status(500).json({
        success: false,
        error: 'Excel generation library (exceljs) not available.'
      });
    }

    const { courseOption, paymentStatus } = req.query;
    const filter = {};
    if (courseOption) filter.courseOption = courseOption;
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    const registrations = await InstructorRefereeRegistration.find(filter).sort({ createdAt: -1 });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Instructor & Referee 2026');

    worksheet.columns = [
      { header: 'S.No', key: 'sno', width: 8 },
      { header: 'Reg No', key: 'registrationNo', width: 22 },
      { header: 'Full Name', key: 'fullName', width: 25 },
      { header: 'Father/Mother Name', key: 'fatherMotherName', width: 25 },
      { header: 'DOB', key: 'dob', width: 14 },
      { header: 'Gender', key: 'gender', width: 10 },
      { header: 'Mobile', key: 'mobileNumber', width: 15 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'State', key: 'state', width: 16 },
      { header: 'PIN Code', key: 'pinCode', width: 10 },
      { header: 'Dan / Degree', key: 'presentDan', width: 15 },
      { header: 'Dan Cert No', key: 'danCertificateNo', width: 20 },
      { header: 'Awaiting Dan Cert?', key: 'isAwaitingDanCertificate', width: 20 },
      { header: 'Academy / Dojang', key: 'academyName', width: 25 },
      { header: 'Experience (Yrs)', key: 'yearsExperience', width: 15 },
      { header: 'Designation', key: 'currentDesignation', width: 15 },
      { header: 'Selected Course(s)', key: 'selectedCourses', width: 35 },
      { header: 'Fee (INR)', key: 'feeAmount', width: 12 },
      { header: 'Transaction Ref / UTR', key: 'transactionId', width: 22 },
      { header: 'Payment Status', key: 'paymentStatus', width: 15 },
      { header: 'Submission Date', key: 'submittedAt', width: 18 }
    ];

    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };

    registrations.forEach((reg, idx) => {
      worksheet.addRow({
        sno: idx + 1,
        registrationNo: reg.registrationNo,
        fullName: reg.fullName,
        fatherMotherName: reg.fatherMotherName,
        dob: reg.dob ? new Date(reg.dob).toLocaleDateString() : '',
        gender: reg.gender,
        mobileNumber: reg.mobileNumber,
        email: reg.email,
        state: reg.state,
        pinCode: reg.pinCode,
        presentDan: reg.presentDan,
        danCertificateNo: reg.danCertificateNo || (reg.isAwaitingDanCertificate ? 'Awaiting Certificate' : 'N/A'),
        isAwaitingDanCertificate: reg.isAwaitingDanCertificate ? 'YES' : 'NO',
        academyName: reg.academyName,
        yearsExperience: reg.yearsExperience,
        currentDesignation: reg.currentDesignation,
        selectedCourses: reg.selectedCourses.join(', '),
        feeAmount: reg.feeAmount,
        transactionId: reg.transactionId,
        paymentStatus: reg.paymentStatus.toUpperCase(),
        submittedAt: reg.submittedAt ? new Date(reg.submittedAt).toLocaleDateString() : ''
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="ITU_Instructor_Referee_Registrations_${new Date().toISOString().slice(0, 10)}.xlsx"`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Error downloading Excel:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate Excel download'
    });
  }
};

// Admin: Delete Registrations
exports.deleteRegistrations = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No registration IDs provided for deletion.'
      });
    }

    const result = await InstructorRefereeRegistration.deleteMany({ _id: { $in: ids } });

    res.status(200).json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} registration(s)`
    });
  } catch (error) {
    console.error('Error deleting registrations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete registrations'
    });
  }
};
