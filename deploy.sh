#!/bin/bash

# Install Tools
npm install -g bower polymer-cli firebase-tools

# For Branch: app-engine 
if [ "$TRAVIS_BRANCH" = "app-engine" ]; then
    # Setup Google Cloud
    echo "App Engine: Setup Google Cloud"
    openssl aes-256-cbc -K $encrypted_37c29f1b58cf_key -iv $encrypted_37c29f1b58cf_iv -in credentials.tar.gz.enc -out credentials.tar.gz -d
    tar -xzf credentials.tar.gz

    # Install, Setup and Build
    echo "App Engine: Install, Setup and Build"
    bower install
    npm install
    polymer build

# For Branch: master (Firebase Hosting)
elif [ "$TRAVIS_BRANCH" = "master" ]; then
    # Install, Setup and Build
    echo "Master: Install, Setup and Build"
    bower install
    npm install
    polymer build

    # Deploy to Firebase Hosting
    echo "Master: Deploy to Firebase Hosting"
    firebase use default
    firebase deploy --token $FIREBASE_TOKEN --non-interactive --only hosting

# For Branch: firebase-hosting (Firebase Hosting)
elif [ "$TRAVIS_BRANCH" = "firebase-hosting" ]; then
    # Install, Setup and Build
    echo "Firebase-hosting: Install, Setup and Build"
    bower install
    npm install
    polymer build
    cd functions
    npm install
    cd ..

    # Deploy to Firebase Hosting and Cloud Functions for Firebase
    echo "Firebase-hosting: Deploy to Firebase Hosting and Cloud Functions for Firebase"
    firebase use development
    firebase deploy --token $FIREBASE_TOKEN --non-interactive --only hosting,functions
else
   echo "Do Nothing"
fi