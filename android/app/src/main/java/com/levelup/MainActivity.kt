package com.levelup
import android.os.Bundle;

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint
import com.swmansion.rnscreens.fragment.restoration.RNScreensFragmentFactory;
class MainActivity : ReactActivity() {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     * It must match "name" in app.json
     */
    override fun getMainComponentName(): String = "levelup"

    /**
     * Returns the instance of the [ReactActivityDelegate]. Here we use a util class
     * [DefaultReactActivityDelegate] which allows you to easily enable Fabric and Concurrent React (aka React 18).
     */
    override fun createReactActivityDelegate(): ReactActivityDelegate {
        return DefaultReactActivityDelegate(
            this,
            mainComponentName,
            // If you opted-in for the New Architecture, enable the Fabric Renderer.
            DefaultNewArchitectureEntryPoint.fabricEnabled
        )
    }

    //react-native-screens override
    override fun onCreate(savedInstanceState: Bundle?) {
      supportFragmentManager.fragmentFactory = RNScreensFragmentFactory()
      super.onCreate(null);
    }
}
