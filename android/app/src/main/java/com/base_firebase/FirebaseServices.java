package com.base_firebase;

import android.content.ComponentName;
import android.content.Intent;
import android.util.Log;

import androidx.localbroadcastmanager.content.LocalBroadcastManager;

import com.facebook.react.HeadlessJsTaskService;
import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

import io.invertase.firebase.Utils;
import io.invertase.firebase.messaging.RNFirebaseBackgroundMessagingService;

public class FirebaseServices extends FirebaseMessagingService {
    private static final String TAG = "RNFMessagingService";

    public static final String MESSAGE_EVENT = "messaging-message";
    public static final String NEW_TOKEN_EVENT = "messaging-token-refresh";
    public static final String REMOTE_NOTIFICATION_EVENT = "notifications-remote-notification";

    @Override
    public void onNewToken(String s) {
        Log.d(TAG, "onNewToken event received");

        Intent newTokenEvent = new Intent(NEW_TOKEN_EVENT);
        LocalBroadcastManager
                .getInstance(this)
                .sendBroadcast(newTokenEvent);
    }

    @Override
    public void onMessageReceived(RemoteMessage message) {
        Log.d(TAG, "onMessageReceived event received");

        if (message.getNotification() != null) {
            // It's a notification, pass to the Notifications module
            Intent notificationEvent = new Intent(REMOTE_NOTIFICATION_EVENT);
            notificationEvent.putExtra("notification", message);

            // Broadcast it to the (foreground) RN Application
            LocalBroadcastManager
                    .getInstance(this)
                    .sendBroadcast(notificationEvent);
        } else {
            // It's a data message
            // If the app is in the foreground we send it to the Messaging module
            if (Utils.isAppInForeground(this.getApplicationContext())) {
                Intent messagingEvent = new Intent(MESSAGE_EVENT);
                messagingEvent.putExtra("message", message);
                // Broadcast it so it is only available to the RN Application
                LocalBroadcastManager
                        .getInstance(this)
                        .sendBroadcast(messagingEvent);
            } else {
                try {
                    // If the app is in the background we send it to the Headless JS Service
                    Intent headlessIntent = new Intent(
                            this.getApplicationContext(),
                            RNFirebaseBackgroundMessagingService.class
                    );
                    headlessIntent.putExtra("message", message);
                    ComponentName name = this.getApplicationContext().startService(headlessIntent);
                    if (name != null) {
                        HeadlessJsTaskService.acquireWakeLockNow(this.getApplicationContext());
                    }
                } catch (IllegalStateException ex) {
                    Log.e(
                            TAG,
                            "Background messages will only work if the message priority is set to 'high'",
                            ex
                    );
                }
            }
        }
    }
}

