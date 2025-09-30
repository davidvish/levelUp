import { createReducer } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import {
    flashcardPreviewDetailsRequestAction,
    flashcardPreviewDetailsSuccessAction,
    flashcardPreviewDetailsFailAction,
    studyPlayRequestAction,
    studyPlaySuccessAction,
    studyListRequestAction,
    studyListSuccessAction,
    studyListFailAction,
    practiceListRequestAction,
    practiceListSuccessAction,
    practiceListFailAction,
    AddUserAttempSuccessAction,
    AddUserAttempRequestAction,
    AddUserAttempFailAction,
    addUserAnsRequestAction,
    addUserAnsSuccessAction,
    addUserAnsFailAction,
    updateProgressRequestAction,
    updateProgressSuccessAction,
    revisitRequestAction,
    revisitSuccessAction,
    getRevisitRequestAction,
    getRevisitSuccessAction,
    getRevisitFailAction,
    playIncorrectRequestAction,
    playIncorrectSuccessAction,
    playIncorrectFailAction,
    practiceReportRequestAction,
    practiceReportSuccessAction,
    practiceReportFailAction
} from './action';

const initialState = {
  flashcardPreviewDetailsData : [],
  studyPlayResponseData : [],
  studyListData : [],
  addUserAttempData : [],
  practiceListData : [],
  addUserAnsData : [],
  previewisLoading: false,
  addUserAttempLoading: false,
  practiceLoading: false,
  studyLoading:false,
  studyPlayLoading: false,
  addUserAnsLoading: false,
  updateProgressData: [],
  updateProgressLoading: false,
  revisitLoading:false,
  revisitData:[],
  getRevisitLoading: false,
  practiceReportLoading: false,
  practiceReportData : [],
  //getRevisitData: []

};
const FlashCardPreviewReducer = createReducer(initialState, builder => {
  builder.addCase(flashcardPreviewDetailsRequestAction, (state, action) => {
    return {
      ...state,
      previewisLoading: true,
    };
  });
  builder.addCase(flashcardPreviewDetailsSuccessAction, (state, action) => {
    return {
      ...state,
      flashcardPreviewDetailsData: action.payload,
      previewisLoading: false,
    };
  });

  builder.addCase(flashcardPreviewDetailsFailAction, (state, action) => {
    return {
      ...state,
      flashcardPreviewDetailsData: [],
      previewisLoading: false,
    };
  });


  builder.addCase(studyPlayRequestAction, (state, action) => {
    return {
      ...state,
      studyPlayLoading: true,
    };
  });
  builder.addCase(studyPlaySuccessAction, (state, action) => {
    return {
      ...state,
      studyPlayResponseData: action.payload,
      studyPlayLoading: false,
    };
  });


  builder.addCase(studyListRequestAction, (state, action) => {
    return {
      ...state,
      studyLoading: true,
    };
  });
  builder.addCase(studyListSuccessAction, (state, action) => {
    return {
      ...state,
      studyListData: action.payload,
      studyLoading: false,
    };
  });

  builder.addCase(studyListFailAction, (state, action) => {
    return {
      ...state,
      studyListData: [],
      studyLoading: false,
    };
  });


  builder.addCase(AddUserAttempRequestAction, (state, action) => {
    return {
      ...state,
      addUserAttempLoading: true,
    };
  });
  builder.addCase(AddUserAttempSuccessAction, (state, action) => {
    return {
      ...state,
      addUserAttempData: action.payload,
      addUserAttempLoading: false,
    };
  });

  builder.addCase(AddUserAttempFailAction, (state, action) => {
    return {
      ...state,
      addUserAttempData: [],
      addUserAttempLoading: false,
    };
  });


  builder.addCase(practiceListRequestAction, (state, action) => {
    return {
      ...state,
      practiceLoading: true,
    };
  });
  builder.addCase(practiceListSuccessAction, (state, action) => {
    return {
      ...state,
      practiceListData: action.payload,
      practiceLoading: false,
    };
  });

  builder.addCase(practiceListFailAction, (state, action) => {
    return {
      ...state,
      practiceListData: [],
      practiceLoading: false,
    };
  });



  builder.addCase(addUserAnsRequestAction, (state, action) => {
    return {
      ...state,
      addUserAnsLoading: true,
    };
  });
  builder.addCase(addUserAnsSuccessAction, (state, action) => {
    return {
      ...state,
      addUserAnsData: action.payload,
      addUserAnsLoading: false,
    };
  });

  builder.addCase(addUserAnsFailAction, (state, action) => {
    return {
      ...state,
      addUserAnsData: [],
      addUserAnsLoading: false,
    };
  });


  builder.addCase(updateProgressRequestAction, (state, action) => {
    return {
      ...state,
      updateProgressLoading: true,
    };
  });
  builder.addCase(updateProgressSuccessAction, (state, action) => {
    return {
      ...state,
      updateProgressData: action.payload,
      updateProgressLoading: false,
    };
  });


  builder.addCase(revisitRequestAction, (state, action) => {
    return {
      ...state,
      revisitLoading: true,
    };
  });
  builder.addCase(revisitSuccessAction, (state, action) => {
    return {
      ...state,
      revisitData : action.payload,
      revisitLoading: false,
    };
  });



  builder.addCase(getRevisitRequestAction, (state, action) => {
    return {
      ...state,
      practiceLoading: true,
    };
  });
  builder.addCase(getRevisitSuccessAction, (state, action) => {
    return {
      ...state,
      //practiceListData: action.payload,
      practiceListData: {
        ...state.practiceListData,
        cards: action.payload.cards, // Update only the cards property
      },
      practiceLoading: false,
    };
  });

  builder.addCase(getRevisitFailAction, (state, action) => {
    return {
      ...state,
      practiceListData: {
        ...state.practiceListData,
        cards: []
      },
      practiceLoading: false,
    };
  });


  builder.addCase(playIncorrectRequestAction, (state, action) => {
    return {
      ...state,
      practiceLoading: true,
    };
  });
  builder.addCase(playIncorrectSuccessAction, (state, action) => {
    return {
      ...state,
      //practiceListData: action.payload,
      practiceListData: {
        ...state.practiceListData,
        cards: action.payload.cards, // Update only the cards property
      },
      practiceLoading: false,
    };
  });

  builder.addCase(playIncorrectFailAction, (state, action) => {
    return {
      ...state,
      practiceListData: {
        ...state.practiceListData,
        cards: []
      },
      practiceLoading: false,
    };
  });



  builder.addCase(practiceReportRequestAction, (state, action) => {
    return {
      ...state,
      practiceReportLoading: true,
    };
  });
  builder.addCase(practiceReportSuccessAction, (state, action) => {
    return {
      ...state,
      practiceReportData: action.payload,
      practiceReportLoading: false,
    };
  });

  builder.addCase(practiceReportFailAction, (state, action) => {
    return {
      ...state,
      practiceReportData: [],
      practiceReportLoading: false,
    };
  });

});
export default FlashCardPreviewReducer;

export const flashcardPreviewSelector = () => {
  const { flashcardPreviewDetailsData, previewisLoading, studyPlayResponseData, studyListData, addUserAttempData, practiceListData, addUserAttempLoading, practiceLoading, studyLoading, studyPlayLoading, addUserAnsData, addUserAnsLoading, updateProgressData, updateProgressLoading, revisitData, revisitLoading, getRevisitLoading, practiceReportData, practiceReportLoading  } =
    useSelector((state : any) => state.FlashCardPreviewReducer);
    return { flashcardPreviewDetailsData, previewisLoading, studyPlayResponseData, studyListData, addUserAttempData, practiceListData, addUserAttempLoading, practiceLoading, studyLoading, studyPlayLoading, addUserAnsData, addUserAnsLoading, updateProgressData, updateProgressLoading, revisitData, revisitLoading, getRevisitLoading, practiceReportData, practiceReportLoading };
};
