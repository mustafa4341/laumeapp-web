import type { Dictionary } from "./index";

/**
 * ENGLISH DICTIONARY
 *
 * SEO and marketing copy mirrors the official Play Store EN listing
 * (source: layar repo `docs/PLAY-CONSOLE-YAYIN-DOSYASI.md` §9) so the store
 * entry and the website describe the same entity in the same words.
 *
 * Typed as `Dictionary`: a missing key is a compile error, never a silent
 * fallback to Turkish.
 */
const en: Dictionary = {
  seo: {
    siteName: "Laume",
    titleTemplate: "%s | Laume",
    appName: "Laume: Letters Left in Places",
    tagline: "Leave a letter at a real place. The only way to read one is to go there.",
    description:
      "On Laume, a letter belongs to a place. You leave a letter somewhere real; " +
      "the only way to read it is to go there. Within 50 meters, the seal opens.",
    socialDescription:
      "Leave a letter at a real place. The only way to read one is to go there — within 50 meters, the seal opens.",
    keywords: [
      "Laume",
      "Laume app",
      "leave a letter at a place",
      "location based letter app",
      "location locked messages",
      "sealed letter app",
      "geolocation notes",
      "real world discovery app",
      "place based messaging",
      "laumeapp",
    ],
  },

  common: {
    skipToContent: "Skip to content",
    languageSwitcherLabel: "Choose language",
    backToTop: "Back to top",
  },

  nav: {
    ariaLabel: "Main menu",
    home: "Home",
    download: "Download",
    about: "About",
    support: "Support",
    legal: "Legal",
  },

  footer: {
    blurb: "A letter belongs to a place. The only way to read one is to go there.",
    navHeading: "Navigation",
    supportHeading: "Support & Help",
    legalHeading: "Legal & Safety",
    discovery: "Discovery",
    productHome: "Product home",
    downloadCenter: "Download",
    about: "About",
    supportCenter: "Support center",
    faq: "Frequently asked questions",
    contact: "Contact",
    legalCenter: "Legal center",
    privacy: "Privacy policy",
    terms: "Terms of use",
    community: "Community guidelines",
    cookies: "Cookie policy",
    refunds: "Refund policy",
    deleteAccount: "Delete account",
    rights: "All rights reserved.",
    domainTagline: "laumeapp.com — A letter belongs to a place",
  },

  discovery: {
    metaTitle: "Laume — A letter belongs to a place",
    arrivalTitle: "There is something here.",
    arrivalSub: "Move.",
    traceTitle: "A trace.",
    traceSub: "Follow it.",
    fragmentTitle: "Something was dropped.",
    fragmentSub: "The trail goes on.",
    fragmentQuote: "…I knew you would find it…",
    approachingSub: "getting closer",
    nearSub: "close.",
    foundTitle: "You found it.",
    holdSub: "Press and hold.",
    pullSub: "Pull up.",
    letterTitle: "This was only the first.",
    letterBody: "Someone, somewhere, left something for you to find.",
    continuationTitle: "What else is near you?",
    continuationCta: "Keep looking →",
    continuationHint: "Opens the app",
    skip: "Skip the discovery",
    audioOn: "Mute sound",
    audioOff: "Unmute sound",
    letterAria: "Pull the letter up",
    sealAria: "Press and hold to break the seal",
    letterRegionAria: "The letter you found",
    sealReadySub: "Open it.",
    skipTitle: "Skip the discovery and go to the home page (Esc)",
    sealHelp:
      "Press and hold space or enter to break the seal. Then pull the letter up with the arrow up key.",
    hints: {
      moveMouse: "Move your cursor across the screen.",
      moveFinger: "Move your finger across the screen.",
      followTrail: "Follow the trail.",
      holdSealMouse: "Press and hold the seal.",
      holdSealFinger: "Press and hold the seal with your finger.",
    },
    announce: {
      trace: "A trace was found.",
      fragment: "A torn piece of paper: I knew you would find it.",
      near: "You are close to the target.",
      sealReady: "You found an envelope. Press and hold to break the seal.",
      letterPull: "The seal is broken. Pull the letter up.",
      letterRead:
        "The letter is open: This was only the first. Someone, somewhere, left something for you to find.",
      continuation: "What else is near you? Keep looking.",
    },
  },

  home: {
    metaTitle: "How Laume Works — Leave a Letter at a Real Place",
    metaDescription:
      "Leave a letter at a real place: text, a photo or a voice whisper. The letter is sealed to those coordinates and only someone within 50 meters can read it.",
    hero: {
      eyebrow: "Location based letter discovery",
      title: "Some things are left to be found.",
      body:
        "Laume is a quiet experience where letters left at a place can only be discovered by people who actually go there.",
      cta: "Start discovering",
      replay: "Replay the discovery →",
      mapLabel: "Your trail map",
      sectionAria: "Laume introduction",
      steps: [
        { num: "01", label: "Leave" },
        { num: "02", label: "Approach" },
        { num: "03", label: "Discover" },
      ],
    },
    intro: {
      sectionAria: "Product philosophy",
      eyebrow: "Product philosophy",
      title: "Why should words belong to the place they were written?",
      p1:
        "The modern internet delivers every message everywhere, instantly. But that speed drained the weight of words and the feeling of the place they were left in. A note written in a sea breeze or on an old street cannot carry the same feeling on a notification screen on the other side of the world.",
      p2:
        "Laume locks words back to physical space. A letter can only be opened where it was left, by someone who physically comes close to it.",
      pillars: [
        { title: "Memory of place", body: "Lasting digital traces left at real coordinates." },
        { title: "The 50 meter rule", body: "Breaking the seal requires physically walking there." },
        { title: "Quiet discovery", body: "No algorithmic noise, no like races, no fake activity." },
      ],
    },
    howCards: [
      { title: "Leave", body: "Leave a thought at a real place." },
      { title: "Approach", body: "Traces only appear as you get closer." },
      { title: "Discover", body: "Break the seal and read what was left for you." },
    ],
    cta: {
      sectionAria: "Download and support call to action",
      eyebrow: "Get started",
      title: "Step into discovery with Laume.",
      body: "Find the seals near you, leave your own story in the city.",
    },
    heroTitle: "A letter belongs to a place.",
    heroBody:
      "You leave a letter next to a bench you love, at the corner where you first met, on the wall facing the sea. The letter stays there. There is exactly one way to read it: to go there.",
    heroCta: "Get Laume",
    heroSecondary: "How it works",
    introHeading: "Content does not scroll. It stands in one place and waits for you.",
    introBody:
      "Social apps keep you on a screen. Laume sends you outside. To see a letter you have to actually walk down that street. That is why everything you read on Laume has been earned.",
    howHeading: "How it works",
    steps: [
      {
        title: "Go somewhere and leave your letter",
        body: "Text, a photo, even a voice whisper.",
      },
      {
        title: "The letter is sealed to those coordinates",
        body: "It is part of that place now.",
      },
      {
        title: "Someone else passes by",
        body: "They see a sealed mark on the map.",
      },
      {
        title: "Within 50 meters the seal opens",
        body: "Not a meter more, not a meter less.",
      },
      {
        title: "Every letter you read enters your archive",
        body: "You fill in your own discovery map.",
      },
    ],
    ctaHeading: "There may be a letter near you.",
    ctaBody: "Laume is free. Plus, Pro and letter credits are optional.",
  },

  about: {
    metaTitle: "What Is Laume? A Letter That Belongs to a Place",
    metaDescription:
      "Social apps keep you on a screen, Laume sends you outside. Content does not scroll; it stands in one place and waits. The Laume manifesto and the idea behind it.",
    heading: "About",
  },

  download: {
    metaTitle: "Download Laume — Android and iOS",
    metaDescription:
      "Get Laume on Google Play. Free to use; Plus, Pro and letter credits are optional. Supports Android 10 and iOS 15 or newer.",
    heading: "Get Laume",
    googlePlay: "Get it on Google Play",
    appStore: "App Store (coming soon)",
    requirements: "Android 10 (API 29) or newer · iOS 15.0 or newer",
  },

  support: {
    metaTitle: "Support Center",
    metaDescription:
      "Questions about Laume, the 50 meter rule, location permissions, account deletion and how to reach us.",
    heading: "Support Center",
    faqCta: "Frequently asked questions",
    contactCta: "Contact us",
  },

  faq: {
    metaTitle: "Frequently Asked Questions",
    metaDescription:
      "Why a letter will not open from a distance, how the 50 meter rule works, whether location is tracked in the background, and how to delete your account.",
    eyebrow: "Laume Knowledge Base",
    heading: "Frequently Asked Questions",
    lede: "The questions people ask about the Laume experience, location permissions and how letters behave.",
    deleteAccountLink: "Account deletion page",
    contactCta: "Did not find your answer? Contact us →",
    backCta: "Back to support center",
    items: [
      {
        q: "Why can I not open a letter from where I am?",
        a: "Laume's core principle is spatial reality. A letter stays sealed until you are within 50 meters of the physical place where its author left it. Make sure your device's location services are on and that the app has precise location permission.",
      },
      {
        q: "How does the seal open?",
        a: "When you come within 50 meters of the point where the letter was left, a wax seal appears on screen. Breaking the seal opens the envelope and the letter becomes readable. Outside 50 meters the seal will not open; the screen shows the remaining distance.",
      },
      {
        q: "Is my location tracked all the time?",
        a: "No. Laume uses your location only while the app is open, to calculate distance. The app never requests background location permission and no continuous location history is stored. What appears on the map is where the letter is, not where you are.",
      },
      {
        q: "How do I delete my account and the letters I left?",
        a: "You can delete your account and letter history at any time from the mobile app settings (Settings > Account > Delete account) or from the account deletion page on the web.",
      },
      {
        q: "Which devices are supported?",
        a: "Laume runs on iPhone models with iOS 15.0 or newer and on Android devices with Android 10 (API 29) or newer, with GPS hardware.",
      },
    ],
  },

  contact: {
    metaTitle: "Contact",
    metaDescription:
      "Reach the Laume support team: technical help, account issues, content reports and feedback.",
    heading: "Contact",
    emailLabel: "Support email",
  },

  legal: {
    metaTitle: "Legal Center",
    metaDescription:
      "Laume terms of use, privacy policy, community guidelines, cookie and refund policies.",
    heading: "Legal Center",
    privacy: {
      metaTitle: "Privacy Policy",
      metaDescription:
        "Your location is used only while the app is open; background location permission is never requested. What appears on the map is your letter, not you.",
    },
    terms: {
      metaTitle: "Terms of Use",
      metaDescription:
        "Terms of use for the Laume mobile app and web platform, account rules and limits of liability.",
    },
    community: {
      metaTitle: "Community Guidelines",
      metaDescription:
        "A letter is left at a real place, and that place is somewhere other people live too. Rules for safe and respectful discovery on Laume.",
    },
    cookies: {
      metaTitle: "Cookie Policy",
      metaDescription:
        "The Laume website uses only technical and strictly necessary cookies. There are no advertising or profiling cookies.",
    },
    refunds: {
      metaTitle: "Refund Policy",
      metaDescription:
        "In-app purchase and refund procedures for Laume Plus, Pro subscriptions and letter credits.",
    },
  },


  pages: {
    about: {
      heading: "About LAUME",
      lede: "Bringing back the sense of place that the digital world forgot.",
      manifestoHeading: "Manifesto",
      manifestoP1:
        "When the internet made everything reachable at any moment, words lost weight. Being able to reach any message from anywhere destroyed the meaning of the place it was left in.",
      manifestoP2:
        "Laume locks words back into the physical world. A letter can only be read on the hill where it was written, on the shore where it rested, on the street where it was forgotten.",
      principlesHeading: "Our principles",
      principles: [
        { title: "Honest discovery", body: "No fake users, no fake counters, no tricks." },
        { title: "Memory of place", body: "Words only mean something together with their physical location." },
        { title: "Privacy", body: "Your location is used only to check distance, only while the app is open." },
      ],
    },
    download: {
      heading: "Get Laume",
      lede: "Start discovering place-bound letters on Android and iOS.",
      playHeading: "Google Play",
      playBody: "For devices running Android 10 (API 29) or newer.",
      appStoreHeading: "Apple App Store",
      appStoreBody: "For iPhones running iOS 15.0 or newer.",
    },
    support: {
      heading: "Support Center",
      lede: "We are here for questions, bug reports and technical support.",
      quickHeading: "Quick links",
      emailHeading: "Email us directly",
      emailBody: "Our official support address for any question or account request:",
      deleteHeading: "Account and data deletion",
      deleteBody:
        "You can delete your account and all letter data from inside the app: Settings → Account → Delete account.",
      deleteCta: "Account deletion page →",
    },
    contact: {
      heading: "Contact",
      lede: "Write to us for technical help, account issues, content reports and feedback.",
      emailHeading: "Support email",
      responseNote: "Messages are answered on business days.",
    },
    legal: {
      heading: "Legal Center",
      lede: "Agreements, data protection standards and terms of use.",
      cards: [
        { title: "Privacy Policy", body: "How your location, account and personal data are protected." },
        { title: "Terms of Use", body: "Service terms, copyright and user obligations." },
        { title: "Community Guidelines", body: "The ethical and safety standards for leaving letters." },
        { title: "Cookie Policy", body: "The technical cookies used on this website." },
        { title: "Refund Policy", body: "In-app purchases and subscription cancellation." },
        { title: "Delete Account", body: "Account deletion notice required by Google Play and Apple." },
      ],
      backCta: "← Back to legal center",
      lastUpdatedLabel: "Last updated",
      lastUpdated: "4 September 2026",
      privacyBody: {
        collectHeading: "Data we collect",
        collectItems: [
          { title: "Account information", body: "Email address, username and profile details." },
          { title: "Location data", body: "Your device location is used for leaving letters and opening seals, only during that action and only with your explicit permission. Background location permission is never requested." },
          { title: "User content", body: "The letter text, photos and voice recordings you create." },
          { title: "Usage data", body: "Error logs, in-app interactions and operating system version." },
        ],
        useHeading: "How we use the data",
        useBody:
          "Collected data is processed only to verify letter distance, keep accounts secure and improve service quality. Your personal data is never sold to any third party.",
      },
    },
  },


  legalBodies: {
    terms: {
      heading: "Terms of Use",
      lede: "By using the Laume platform and mobile app you accept these terms.",
      sections: [
        {
          heading: "Nature of the service",
          body: "Laume is a platform that lets people leave digital content at real locations and discover that content. Users are personally responsible for the accuracy and legality of what they leave.",
        },
        {
          heading: "Prohibited actions",
          body: "Trespassing on private property, leaving letters in places that endanger others, threats, harassment and harmful content are strictly forbidden and result in account closure.",
        },
        {
          heading: "Safety",
          body: "Never enter traffic, private property, restricted or dangerous areas to reach a letter. Do not use the app while driving.",
        },
      ],
    },
    cookies: {
      heading: "Cookie Policy",
      lede: "Your privacy is treated with the utmost care on this website.",
      sections: [
        {
          heading: "Cookies we use",
          body: "The website uses only strictly necessary local storage for session preferences: whether you completed the discovery, your sound preference and your language choice.",
        },
        {
          heading: "What we do not use",
          body: "No third-party advertising or profiling cookies are used.",
        },
      ],
    },
    community: {
      heading: "Community Guidelines",
      lede: "A letter is left at a real place, and that place is somewhere other people live too.",
      sections: [
        {
          heading: "Respect the place",
          body: "Do not leave letters on private property, at places of worship, or in dangerous or restricted areas. The place you choose must be somewhere the finder can safely stand.",
        },
        {
          heading: "Respect people",
          body: "Threats, harassment, hate speech, exposing personal information and sharing content without consent are forbidden.",
        },
        {
          heading: "Reporting",
          body: "If you come across a letter that breaks these rules, report it from inside the app. Every report is reviewed.",
        },
      ],
    },
    refunds: {
      heading: "Refund Policy",
      lede: "Purchase and refund procedures for Plus, Pro subscriptions and letter credits.",
      sections: [
        {
          heading: "Subscriptions",
          body: "Subscriptions are managed through your Google Play account and can be cancelled at any time. Cancelling keeps access until the end of the current period.",
        },
        {
          heading: "Refund requests",
          body: "Refunds are subject to the store provider's own refund policy (Google Play). Requests must first be made through the store.",
        },
        {
          heading: "Letter credits",
          body: "Used letter credits cannot be refunded; for unused credits please contact the support team.",
        },
      ],
    },
  },

  letter: {
    invalidTitle: "Invalid letter",
    metaTitlePrefix: "Letter",
    metaDescription:
      "This letter was left at a place in the physical world. To read all of it you have to go there.",
    bridgeEyebrow: "Laume deep link bridge",
    sealTitlePrefix: "Laume seal",
    sealDescription:
      "A Laume letter left at this location is waiting for you. Open it in the app to break the seal.",
    openInApp: "Open in the app",
    downloadCta: "Get Laume",
    bridgeConnecting: "Connecting to the LAUME app…",
    bridgeFallback:
      "If the LAUME app did not open automatically, use the button below to open it directly or download the app.",
    previewQuote: "“This is only a letter. The rest is waiting for you on LAUME.”",
    privacyNoticeTitle: "Privacy and location protection",
    privacyNoticeBody:
      "The full letter and its exact coordinates can only be seen by physically coming within 50 meters of the place, using the LAUME mobile app.",
    backHome: "← Back to the LAUME home page",
  },
};

export default en;
