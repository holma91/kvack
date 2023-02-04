export const injects: { [key: string]: { js: string; css: string } } = {
  google: {
    js: ``,
    css: `

      #gb, #SIvCob  {
        visibility: hidden;
        display: none;
      }

      .FPdoLc.lJ9FBc, .o3j99.c93Gbe {
        visibility: hidden;
        display: none;
      }

      body::-webkit-scrollbar {
        display: none;
      }
    `,
  },
  duckduckgo: {
    js: `
      for (const element of document.getElementsByClassName('onboarding-ed js-onboarding-ed')) {
        element.remove();
      }
    `,
    css: `
      .header--aside.js-header-aside, 
      .tag-home__item.js-tagline,
      .onboarding-ed__arrow-teaser__alpinist,
      .onboarding-ed__arrow-teaser__arrow-wrapper,
      .onboarding-ed__slide.onboarding-ed__slide-1.js-onboarding-ed-slide.js-onboarding-ed-slide-1,
      .onboarding-ed__slide.onboarding-ed__slide-2.js-onboarding-ed-slide.js-onboarding-ed-slide-2,
      .onboarding-ed__slide.onboarding-ed__slide-3.js-onboarding-ed-slide.js-onboarding-ed-slide-3,
      .onboarding-ed__slide.onboarding-ed__slide-4.js-onboarding-ed-slide.js-onboarding-ed-slide-4,
      .onboarding-ed__arrow.js-onboarding-ed-arrow,
      .onboarding-ed.js-onboarding-ed 
      {
        visibility: hidden;
        display: none;
      }

      body::-webkit-scrollbar {
        display: none;
      }
    `,
  },
  wolframalpha: {
    js: ``,
    css: ``,
  },
  wikipedia: {
    js: ``,
    css: ``,
  },
  static: {
    js: ``,
    css: ``,
  },
  bing: {
    js: ``,
    css: ``,
  },
  chatgpt: {
    js: ``,
    css: ``,
  },
  vSeparator: {
    js: ``,
    css: `
      
    `,
  },
  hSeparator: {
    js: ``,
    css: `
      
    `,
  },
};
