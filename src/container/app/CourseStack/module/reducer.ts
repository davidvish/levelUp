import { createReducer } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import {
  getScormChaptersByCourseRequestAction,
  getScormChaptersByCourseSuccessAction,
  getScormChaptersByCourseFailAction,
  coursePlayRequestAction,
  coursePlaySuccessAction,
  coursePlayFailAction,
  scromPlayRequestAction,
  scromPlaySuccessAction,
  scromPlayFailAction,
  materialProgressRequestAction,
  materialProgressSuccessAction,
  materialProgressFailAction,
  updateMaterialRequestAction,
  updateMaterialSuccessAction,
  examAddUserAttemptRequestAction,
  examAddUserAttemptSuccessAction,
  examAddUserAttemptFailAction,
  examPlayRequestAction,
  examPlaySuccessAction,
  examPlayFailAction,
  addKCResponseRequestAction,
  addKCResponseSuccessAction,
  addKCResponseFailAction,
  updateKCProgressRequestAction,
  updateKCProgressSuccessAction,
  updateKCProgressFailAction,
  startExamRequestAction,
  startExamSuccessAction,
  startExamFailAction,
  addExamResponseRequestAction,
  addExamResponseSuccessAction,
  getExamResultRequestAction,
  getExamResultSuccessAction,
  getExamResultFailAction,
  getUserGamificationPointsRequestAction,
  getUserGamificationPointsSuccessAction,
  getUserGamificationPointsFailAction,
  getUserGamificationPopUpAndTotalPointsRequestAction,
  getUserGamificationPopUpAndTotalPointsSuccessAction,
  getUserGamificationPopUpAndTotalPointsFailAction,
  gamificationBooleanSuccessAction,
  gamificationBooleanFailAction,
  createEnrollmentRequestAction,
  createEnrollmentSuccessAction,
  createEnrollmentFailAction,
  AttestionQuestionRequestAction,
  AttestionQuestionSuccessAction,
  AttestionQuestionFailAction,
  SubmitAttestationRequestAction,
  SubmitAttestationSuccessAction,
  SubmitAttestationFailAction,
  GetAssignmentRequestAction,
  GetAssignmentSuccessAction,
  GetAssignmentFailAction,
  AssignmentSubmissionRequestAction,
  AssignmentSubmissionSuccessAction,
  AssignmentSubmissionFailAction,
  GetTimeOnAssignmentDetailRequestAction,
  GetTimeOnAssignmentDetailSuccessAction,
  GetTimeOnAssignmentDetailFailAction
} from './action';

const initialState = {
  scromChapterByData: [],
  scromChapterLoading: false,
  coursePlayLoading: false,
  coursePlayData: [],
  scromPlayLoading: false,
  scromPlayData: [],
  materialProgressLoading: false,
  materialProgressData: [],
  updateMaterialLoading: false,
  updateMaterialData: [],
  examAddUserAttemptLoading: false,
  examAddUserAttemptData: [],
  examPlayLoading: false,
  examPlayData: [],
  addKCResponseLoading: false,
  addKCResponseData: [],
  updateKCProgressLoading : false,
  updateKCProgressData : [],
  startExamLoading : false,
  startExamData : [],
  addExamResponseLoading : false,
  addExamResponseData: [],
  getExamResultLoading: false,
  getExamResultData: [],
  getUserGamificationPoints:[],
  getUserGamificationPointsLoading:false,
  gamificationPopUpAndTotalPointsData:[],
  gamificationPopUpAndTotalPointsLoading:false,
  gamificationBooleanData: "",
  createEnrollmentData:[],
  createEnrollmentLoading:false,
  attestionQuestionData:[],
  attestionQuestionLoading:false,
  SubmitAttestationData:[],
  SubmitAttestationLoading:false,
  GetAssignmentData:[],
  GetAssignmentLoading:false,
  GetTimeOnAssignmentDetailData:[],
  GetTimeOnAssignmentDetailLoading:false,
  AssignmentSubmissionData:[],
  AssignmentSubmissionLoading:false,
  
};

const CourseStackReducer = createReducer(initialState, builder => {
  builder.addCase(getScormChaptersByCourseRequestAction, (state, action) => {
    return {
      ...state,
      scromChapterLoading: true,
    };
  });
  builder.addCase(getScormChaptersByCourseSuccessAction, (state, action) => {
    return {
      ...state,
      scromChapterByData: action.payload,
      scromChapterLoading: false,
    };
  });

  builder.addCase(getScormChaptersByCourseFailAction, (state, action) => {
    return {
      ...state,
      scromChapterByData: [],
      scromChapterLoading: false,
    };
  });


  builder.addCase(createEnrollmentRequestAction, (state, action) => {
    return {
      ...state,
      createEnrollmentLoading: true,
    };
  });
  builder.addCase(createEnrollmentSuccessAction, (state, action) => {
    return {
      ...state,
      createEnrollmentData: action.payload,
      createEnrollmentLoading: false,
    };
  });

  builder.addCase(createEnrollmentFailAction, (state, action) => {
    return {
      ...state,
      createEnrollmentData: [],
      createEnrollmentLoading: false,
    };
  });


  builder.addCase(gamificationBooleanSuccessAction, (state, action) => {
    return {
      ...state,
      gamificationBooleanData: action.payload,
    };
  });
  builder.addCase(gamificationBooleanFailAction, (state, action) => {
    return {
      ...state,
      gamificationBooleanData: "",
    };
  });


  builder.addCase(getUserGamificationPointsRequestAction, (state, action) => {
    return {
      ...state,
      getUserGamificationPointsLoading: true,
    };
  });
  builder.addCase(getUserGamificationPointsSuccessAction, (state, action) => {
    return {
      ...state,
      getUserGamificationPoints: action.payload,
      getUserGamificationPointsLoading: false,
    };
  });

  builder.addCase(getUserGamificationPointsFailAction, (state, action) => {
    return {
      ...state,
      getUserGamificationPoints: [],
      getUserGamificationPointsLoading: false,
    };
  });


  builder.addCase(getUserGamificationPopUpAndTotalPointsRequestAction, (state, action) => {
    return {
      ...state,
      gamificationPopUpAndTotalPointsLoading: true,
    };
  });
  builder.addCase(getUserGamificationPopUpAndTotalPointsSuccessAction, (state, action) => {
    return {
      ...state,
      gamificationPopUpAndTotalPointsData: action.payload,
      gamificationPopUpAndTotalPointsLoading: false,
    };
  });

  builder.addCase(getUserGamificationPopUpAndTotalPointsFailAction, (state, action) => {
    return {
      ...state,
      gamificationPopUpAndTotalPointsData: [],
      gamificationPopUpAndTotalPointsLoading: false,
    };
  });


  builder.addCase(coursePlayRequestAction, (state, action) => {
    return {
      ...state,
      coursePlayLoading: true,
    };
  });
  builder.addCase(coursePlaySuccessAction, (state, action) => {
    return {
      ...state,
      coursePlayData: action.payload,
      coursePlayLoading: false,
    };
  });

  builder.addCase(coursePlayFailAction, (state, action) => {
    return {
      ...state,
      coursePlayData: [],
      coursePlayLoading: false,
    };
  });


  builder.addCase(scromPlayRequestAction, (state, action) => {
    return {
      ...state,
      scromPlayLoading: true,
    };
  });
  builder.addCase(scromPlaySuccessAction, (state, action) => {
    return {
      ...state,
      scromPlayData: action.payload,
      scromPlayLoading: false,
    };
  });

  builder.addCase(scromPlayFailAction, (state, action) => {
    return {
      ...state,
      scromPlayData: [],
      scromPlayLoading: false,
    };
  });


  builder.addCase(materialProgressRequestAction, (state, action) => {
    return {
      ...state,
      materialProgressLoading: true,
    };
  });
  builder.addCase(materialProgressSuccessAction, (state, action) => {
    return {
      ...state,
      materialProgressData: action.payload,
      materialProgressLoading: false,
    };
  });

  builder.addCase(materialProgressFailAction, (state, action) => {
    return {
      ...state,
      materialProgressData: [],
      materialProgressLoading: false,
    };
  });


  builder.addCase(updateMaterialRequestAction, (state, action) => {
    return {
      ...state,
      updateMaterialLoading: true,
    };
  });
  builder.addCase(updateMaterialSuccessAction, (state, action) => {
    return {
      ...state,
      updateMaterialData: action.payload,
      updateMaterialLoading: false,
    };
  });


  builder.addCase(examAddUserAttemptRequestAction, (state, action) => {
    return {
      ...state,
      examAddUserAttemptLoading: true,
    };
  });
  builder.addCase(examAddUserAttemptSuccessAction, (state, action) => {
    return {
      ...state,
      examAddUserAttemptData: action.payload,
      examAddUserAttemptLoading: false,
    };
  });

  builder.addCase(examAddUserAttemptFailAction, (state, action) => {
    return {
      ...state,
      examAddUserAttemptData: [],
      examAddUserAttemptLoading: false,
    };
  });


  builder.addCase(examPlayRequestAction, (state, action) => {
    return {
      ...state,
      examPlayLoading: true,
    };
  });
  builder.addCase(examPlaySuccessAction, (state, action) => {
    return {
      ...state,
      examPlayData: action.payload,
      examPlayLoading: false,
    };
  });

  builder.addCase(examPlayFailAction, (state, action) => {
    return {
      ...state,
      examPlayData: [],
      examPlayLoading: false,
    };
  });


  builder.addCase(addKCResponseRequestAction, (state, action) => {
    return {
      ...state,
      addKCResponseLoading: true,
    };
  });
  builder.addCase(addKCResponseSuccessAction, (state, action) => {
    return {
      ...state,
      addKCResponseData: action.payload,
      addKCResponseLoading: false,
    };
  });

  builder.addCase(addKCResponseFailAction, (state, action) => {
    return {
      ...state,
      addKCResponseData: [],
      addKCResponseLoading: false,
    };
  });

  builder.addCase(updateKCProgressRequestAction, (state, action) => {
    return {
      ...state,
      updateKCProgressLoading: true,
    };
  });
  builder.addCase(updateKCProgressSuccessAction, (state, action) => {
    return {
      ...state,
      updateKCProgressData: action.payload,
      updateKCProgressLoading: false,
    };
  });

  builder.addCase(updateKCProgressFailAction, (state, action) => {
    return {
      ...state,
      updateKCProgressData: [],
      updateKCProgressLoading: false,
    };
  });



  builder.addCase(startExamRequestAction, (state, action) => {
    return {
      ...state,
      startExamLoading: true,
    };
  });
  builder.addCase(startExamSuccessAction, (state, action) => {
    return {
      ...state,
      startExamData: action.payload,
      startExamLoading: false,
    };
  });

  builder.addCase(startExamFailAction, (state, action) => {
    return {
      ...state,
      startExamData: [],
      startExamLoading: false,
    };
  });

  builder.addCase(addExamResponseRequestAction, (state, action) => {
    return {
      ...state,
      addExamResponseLoading: true,
    };
  });
  builder.addCase(addExamResponseSuccessAction, (state, action) => {
    return {
      ...state,
      addExamResponseData: action.payload,
      addExamResponseLoading: false,
    };
  });


  builder.addCase(getExamResultRequestAction, (state, action) => {
    return {
      ...state,
      getExamResultLoading: true,
    };
  });
  builder.addCase(getExamResultSuccessAction, (state, action) => {
    return {
      ...state,
      getExamResultData: action.payload,
      getExamResultLoading: false,
    };
  });
  builder.addCase(getExamResultFailAction, (state, action) => {
    return {
      ...state,
      getExamResultData: [],
      getExamResultLoading: false,
    };
  });


   builder.addCase(AttestionQuestionRequestAction, (state, action) => {
    return {
      ...state,
      attestionQuestionLoading: true,
    };
  });
  builder.addCase(AttestionQuestionSuccessAction, (state, action) => {
    return {
      ...state,
      attestionQuestionData: action.payload,
      attestionQuestionLoading: false,
    };
  });

  builder.addCase(AttestionQuestionFailAction, (state, action) => {
    return {
      ...state,
      attestionQuestionData: [],
      attestionQuestionLoading: false,
    };
  });


  builder.addCase(SubmitAttestationRequestAction, (state, action) => {
    return {
      ...state,
      SubmitAttestationLoading: true,
    };
  });
  builder.addCase(SubmitAttestationSuccessAction, (state, action) => {
    return {
      ...state,
      SubmitAttestationData: action.payload,
      SubmitAttestationLoading: false,
    };
  });

  builder.addCase(SubmitAttestationFailAction, (state, action) => {
    return {
      ...state,
      SubmitAttestationData: [],
      SubmitAttestationLoading: false,
    };
  });
  
  //Edit Newly Added Reducer Here GetAssignment
  builder.addCase(GetAssignmentRequestAction, (state, action) => {
    return {
      ...state,
      GetAssignmentLoading: true,
    };
  });
  builder.addCase(GetAssignmentSuccessAction, (state, action) => {
    return {
      ...state,
      GetAssignmentData: action.payload,
      GetAssignmentLoading: false,
    };
  }); 
  builder.addCase(GetAssignmentFailAction, (state, action) => {
    return {
      ...state,
      GetAssignmentData: [],
      GetAssignmentLoading: false,
    };
  });

   //Edit Newly Added Reducer Here GetTimeOnAssignmentDetail
  builder.addCase(GetTimeOnAssignmentDetailRequestAction, (state, action) => {
    return {
      ...state,
      GetTimeOnAssignmentDetailLoading: true,
    };
  });
  builder.addCase(GetTimeOnAssignmentDetailSuccessAction, (state, action) => {
    return {
      ...state,
      GetTimeOnAssignmentDetailData: action.payload,
      GetTimeOnAssignmentDetailLoading: false,
    };
  }); 
  builder.addCase(GetTimeOnAssignmentDetailFailAction, (state, action) => {
    return {
      ...state,
      GetTimeOnAssignmentDetailData: [],
      GetTimeOnAssignmentDetailLoading: false,
    };
  });

    //Edit Newly Added Reducer Here AssignmentSubmission
  builder.addCase(AssignmentSubmissionRequestAction, (state, action) => {
    return {
      ...state,
      AssignmentSubmissionLoading: true,
    };
  });
  builder.addCase(AssignmentSubmissionSuccessAction, (state, action) => {
    return {
      ...state,
      AssignmentSubmissionData: action.payload,
      AssignmentSubmissionLoading: false,
    };
  }); 
  builder.addCase(AssignmentSubmissionFailAction, (state, action) => {
    return {
      ...state,
      AssignmentSubmissionData: [],
      AssignmentSubmissionLoading: false,
    };
  });
});
export default CourseStackReducer;

export const scromChapterSelector = () => {
  const {AssignmentSubmission,GetTimeOnAssignmentDetailData,GetAssignmentData,SubmitAttestationData, SubmitAttestationLoading, attestionQuestionData, attestionQuestionLoading, gamificationBooleanData, gamificationPopUpAndTotalPointsData, gamificationPopUpAndTotalPointsLoading, getUserGamificationPoints, getUserGamificationPointsLoading, getExamResultData, getExamResultLoading, addExamResponseData, addExamResponseLoading, startExamData, startExamLoading, updateKCProgressData, updateKCProgressLoading, scromChapterByData, scromChapterLoading, coursePlayData, coursePlayLoading, scromPlayData, scromPlayLoading, materialProgressData, materialProgressLoading, updateMaterialData, updateMaterialLoading, examAddUserAttemptLoading, examAddUserAttemptData, examPlayLoading, examPlayData, addKCResponseData, addKCResponseLoading } =
    useSelector((state: any) => state.CourseStackReducer);
  return {AssignmentSubmission,GetTimeOnAssignmentDetailData,GetAssignmentData,SubmitAttestationData, SubmitAttestationLoading, attestionQuestionData, attestionQuestionLoading, gamificationBooleanData, gamificationPopUpAndTotalPointsData, gamificationPopUpAndTotalPointsLoading, getUserGamificationPoints, getUserGamificationPointsLoading, addExamResponseData, addExamResponseLoading, startExamData, startExamLoading, updateKCProgressData, updateKCProgressLoading, scromChapterByData, scromChapterLoading, coursePlayData, coursePlayLoading, scromPlayData, scromPlayLoading, materialProgressData, materialProgressLoading, updateMaterialData, updateMaterialLoading, examAddUserAttemptLoading, examAddUserAttemptData, examPlayLoading, examPlayData, addKCResponseData, addKCResponseLoading};
};