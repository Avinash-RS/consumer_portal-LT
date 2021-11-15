export const APP_CONSTANTS = {
  MIMETypes: {
    TXT: 'text/plain',
    DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingm1.document',
    DOC: 'application/ msword',
    PDF: 'application/pdf',
    JPG: 'image/jpeg',
    BMP: 'image/bmp',
    PNG: 'image/png',
    XLS: 'application/vnd.ms-excel',
    XLSX: 'application/vnd.openxmlformats-officedocument.spreadsheetm1.sheet',
    RTF: 'application/rtf',
    PPT: 'application/vnd.ms-powerpoint',
    PPTX: 'application/vnd.openxmlformats-officedocument.presentationm1.presentation',
  },
  DRUPAL_ADMIN_USERNAME: 'admin',
  DRUPAL_ADMIN_PASSWORD: 'admin@123',
  
  // Route endpoints
  ENDPOINTS: {
    home: '/assessmentHome',
    certificationDetails: '/certificationDetails',
    faq: '/faq',
    userprofile: '/userProfile',
    onBoard: {
      home: '/onBoard',
      login: '/onBoard/login',
      forgetpwd: '/onBoard/forgetpwd'
    },
    catalog: {
      home: '/catalog',
      catalogHome: '/catalog/catalogHome',
      aboutAssessment: '/catalog/aboutAssessment',
      assessmentType: '/catalog/assessmentType',
      certifyAssessment: '/catalog/certifyAssessment',
      search: '/catalog/search'
    },
    skillOMeter:{
      dashBoard:''
    }
  },

  // Routes
  ROUTES: {
    home: 'assessmentHome',
    certificationDetails: 'certificationDetails',
    faq: 'faq',
    userprofile: 'userProfile',
    myAssessment: 'myAssessment',
    onBoard: {
      home: 'onBoard',
      login: 'login',
      forgetpwd: 'forgetpwd'
    },
    catalog: {
      home: 'catalog',
      catalogHome: 'catalogHome',
      aboutAssessment: 'aboutAssessment',
      assessmentType: 'assessmentType',
      certifyAssessment: 'certifyAssessment',
      search: 'search'
    },
    skillOMeter:{
      dashBoard:'skillOmeter'
    }
  }
};
