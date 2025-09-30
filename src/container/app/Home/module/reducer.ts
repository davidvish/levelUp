import { createReducer } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import {
  upcomingEventsRequestAction,
  upcomingEventsSuccessAction,
  upcomingEventsFailAction,
  countinueLearningRequestAction,
  countinueLearningSuccessAction,
  countinueLearningFailAction,
  getUserEntitiesRequestAction,
  getUserEntitiesCourseSuccessAction,
  getUserEntitiesFlashCardSuccessAction,
  getUserEntitiesPathSuccessAction,
  getUserEntitiesFailAction,
  barChartRequestAction,
  barChartSuccessAction,
  barChartFailAction,
  pieChartRequestAction,
  pieChartSuccessAction,
  pieChartFailAction,
  getProfileRequestAction,
  getProfileSuccessAction,
  getProfileFailAction,
  watchHistoryDeleteRequestAction,
  watchHistoryDeleteSuccessAction,
  storeCourseItemDataOnNavigationAction,
  storeCourseItemDataOnNavigationClear,
  storePathItemDataOnNavigationAction,
  storePathItemDataOnNavigationClear,
  getGamificationPointRequestAction,
  getGamificationPointSuccessAction,
  getGamificationPointFailAction,
  getSettingsRequestAction,
  getSettingsSuccessAction,
  getSettingsFailAction,
  refreshTokenRequestAction,
  refreshTokenSuccessAction,
  getTokenExpireResponseSuccessAction,
  getTokenExpireResponseFailAction
} from './action';

const initialState = {
  upcomingEventUserData: [],
  countinueLearningData: [],
  courseListData: [],
  flashCardListData: [],
  pathListData: [],
  barChartData: [],
  pieChartData: [],
  getProfileData: [],
  watchHistoryDeleteData: [],
  upcomingEventLoading: false,
  countinueLearningLoading: false,
  barChartLoading: false,
  pieChartLoading: false,
  isLoading: false,
  storeCourseItemData: {},
  storePathItemData: {},
  gamificationPointData:[],
  gamificationPointLoading:false,
  getSettingData:[],
  getSettingLoading:false,
  refreshTokenData: [],
  
};
const homeScreenReducer = createReducer(initialState, builder => {
  builder.addCase(upcomingEventsRequestAction, (state, action) => {
    return {
      ...state,
      upcomingEventLoading: true,
    };
  });
  builder.addCase(upcomingEventsSuccessAction, (state, action) => {
    return {
      ...state,
      upcomingEventUserData: action.payload,
      upcomingEventLoading: false,
    };
  });

  builder.addCase(upcomingEventsFailAction, (state, action) => {
    return {
      ...state,
      upcomingEventUserData: [],
      upcomingEventLoading: false,
    };
  });


   builder.addCase(refreshTokenRequestAction, (state, action) => {
      return {
        ...state,
        isLoading: true,
      };
    });
    builder.addCase(refreshTokenSuccessAction, (state, action) => {
      return {
        ...state,
        refreshTokenData:action.payload,
        isLoading: false,
      };
    });


  builder.addCase(getGamificationPointRequestAction, (state, action) => {
    return {
      ...state,
      gamificationPointLoading: true,
    };
  });
  builder.addCase(getGamificationPointSuccessAction, (state, action) => {
    return {
      ...state,
      gamificationPointData: action.payload,
      gamificationPointLoading: false,
    };
  });

  builder.addCase(getGamificationPointFailAction, (state, action) => {
    return {
      ...state,
      gamificationPointData: [],
      gamificationPointLoading: false,
    };
  });


  builder.addCase(getSettingsRequestAction, (state, action) => {
    return {
      ...state,
      getSettingLoading: true,
    };
  });
  builder.addCase(getSettingsSuccessAction, (state, action) => {
    return {
      ...state,
      getSettingData: action.payload,
      getSettingLoading: false,
    };
  });

  builder.addCase(getSettingsFailAction, (state, action) => {
    return {
      ...state,
      getSettingData: [],
      getSettingLoading: false,
    };
  });


  builder.addCase(countinueLearningRequestAction, (state, action) => {
    return {
      ...state,
      countinueLearningLoading: true,
    };
  });
  builder.addCase(countinueLearningSuccessAction, (state, action) => {
    return {
      ...state,
      countinueLearningData: action.payload,
      countinueLearningLoading: false,
      isLoading:false
    };
  });

  builder.addCase(countinueLearningFailAction, (state, action) => {
    return {
      ...state,
      countinueLearningData: [],
      countinueLearningLoading: false,
      isLoading: false
    };
  });


  builder.addCase(getUserEntitiesRequestAction, (state, action) => {
    return {
      ...state,
      isLoading: true,      
    };
  });
  builder.addCase(getUserEntitiesCourseSuccessAction, (state, action) => {
    return {
      ...state,
      courseListData: action.payload,
      isLoading: false,
    };
  });

  builder.addCase(getUserEntitiesFlashCardSuccessAction, (state, action) => {
    return {
      ...state,
      flashCardListData: action.payload,
      isLoading: false,
    };
  });

  builder.addCase(getUserEntitiesPathSuccessAction, (state, action) => {
    return {
      ...state,
      pathListData: action.payload,
      isLoading: false,
    };
  });

  builder.addCase(getUserEntitiesFailAction, (state, action) => {
    return {
      ...state,
      courseListData: [],
      flashCardListData: [],
      pathListData: [],
      isLoading: false,
    };
  });



  builder.addCase(barChartRequestAction, (state, action) => {
    return {
      ...state,
      barChartLoading: true,
    };
  });
  builder.addCase(barChartSuccessAction, (state, action) => {
    return {
      ...state,
      barChartData: action.payload,
      barChartLoading: false,
    };
  });

  builder.addCase(barChartFailAction, (state, action) => {
    return {
      ...state,
      barChartData: [],
      barChartLoading: false,
    };
  });



  builder.addCase(pieChartRequestAction, (state, action) => {
    return {
      ...state,
      pieChartLoading: true,
    };
  });
  builder.addCase(pieChartSuccessAction, (state, action) => {
    return {
      ...state,
      pieChartData: action.payload,
      pieChartLoading: false,
    };
  });

  builder.addCase(pieChartFailAction, (state, action) => {
    return {
      ...state,
      pieChartData: [],
      pieChartLoading: false,
    };
  });



  builder.addCase(getProfileRequestAction, (state, action) => {
    return {
      ...state,
      isLoading: true,
    };
  });
  builder.addCase(getProfileSuccessAction, (state, action) => {
    return {
      ...state,
      getProfileData: action.payload,
      isLoading: false,
    };
  });

  builder.addCase(getProfileFailAction, (state, action) => {
    return {
      ...state,
      getProfileData: [],
      isLoading: false,
    };
  });


  builder.addCase(watchHistoryDeleteRequestAction, (state, action) => {
    return {
      ...state,
      isLoading: true,
    };
  });
  builder.addCase(watchHistoryDeleteSuccessAction, (state, action) => {
    return {
      ...state,
      watchHistoryDeleteData : action.payload,
      isLoading: false,
    };
  });

  builder.addCase(storeCourseItemDataOnNavigationAction, (state, action) => {
    return {
      ...state,
      storeCourseItemData : action.payload,
    };
  });

  builder.addCase(storeCourseItemDataOnNavigationClear, (state, action) => {
    return {
      ...state,
      storeCourseItemData : [],
    };
  });


  builder.addCase(storePathItemDataOnNavigationAction, (state, action) => {
    return {
      ...state,
      storePathItemData : action.payload,
    };
  });

  builder.addCase(storePathItemDataOnNavigationClear, (state, action) => {
    return {
      ...state,
      storePathItemData : [],
    };
  });

});
export default homeScreenReducer;

export const homeScreenSelector = () => {
  const {refreshTokenData, getSettingData, getSettingLoading, gamificationPointData, gamificationPointLoading, storePathItemData, storeCourseItemData, upcomingEventUserData, isLoading, countinueLearningData, courseListData, flashCardListData, pathListData, barChartData, pieChartData, getProfileData, watchHistoryDeleteData, upcomingEventLoading, countinueLearningLoading, pieChartLoading, barChartLoading } =
    useSelector((state : any) => state.homeScreenReducer);
  return {refreshTokenData, getSettingData, getSettingLoading, gamificationPointData, gamificationPointLoading, storePathItemData, storeCourseItemData, upcomingEventUserData, isLoading, countinueLearningData, courseListData, flashCardListData, pathListData, barChartData, pieChartData, getProfileData, watchHistoryDeleteData, upcomingEventLoading, countinueLearningLoading, pieChartLoading, barChartLoading };
};