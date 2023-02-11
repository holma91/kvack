export const cssInserts: {
  [key: string]: { styles: string; ads: string; recommended: string };
} = {
  google: {
    styles: `
      #main {
        background-color: #171717 !important;
      }
  
      .V3FYCf {
        background-color: #171717 !important;
      }
      
      .kvH3mc.BToiNc.UK95Uc {
        background-color: #171717 !important;
      }
  
      .GLI8Bc.UK95Uc {
        background-color: #171717 !important;
      }
      
      /* allt, bilder etc */
      #pTwnEc {
        background-color: #171717 !important;
      }
  
      /* results */
      #appbar {
        background-color: #171717 !important;
      }
      
      /* header ish */
      .sfbg {
        background-color: #171717 !important;
      }
    `,
    ads: ``,
    recommended: `
      body::-webkit-scrollbar {
        display: none;
      }
    `,
  },
  duckduckgo: {
    styles: `
      .site-wrapper.js-site-wrapper {
        background-color: #171717;
      }
    `,
    ads: ``,
    recommended: `
      body::-webkit-scrollbar {
        display: none;
      }
    `,
  },
  chatgpt: {
    styles: `
      /* header */
      .sticky.top-0.z-10.flex.items-center.border-b.bg-gray-800.pl-1.pt-1.text-gray-200 {
        background-color: #171717;
      }
      
      /* main part */
      .text-gray-800.w-full.px-6 {
        background-color: #171717;
      }
      
      /*  main sides ish */
      .flex.flex-col.items-center.text-sm.h-full {
        background-color: #171717;
      }
      
      /* weird bottom of main part */
      .w-full.h-32.flex-shrink-0 {
        background-color: #171717;
      }
    
      /* bottom */
      .absolute.bottom-0.left-0.w-full.border-t.bg-white {
        background-color: #171717;
      }
      
      /* text from user */
      .w-full.border-b.text-gray-800.group {
        background-color: #171717;
        
      }
      
      /* text from gpt */
      .text-base.gap-4.m-auto.p-4.flex {
        background-color: #171717;
      }
      
      /* where no text is yet */
      .w-full.h-32.flex-shrink-0,
      .react-scroll-to-bottom--css-daeix-1n7m0yu,
      .react-scroll-to-bottom--css-zvats-1n7m0yu {
        background-color: #171717;
      }
      
      .flex-1.overflow-hidden * {
        background-color: #171717;
      }
    `,
    ads: ``,
    recommended: `
      body::-webkit-scrollbar {
        display: none;
      }
    `,
  },
  wolframalpha: {
    styles: `
      
    `,
    ads: `
      ._2Bem > a:first-child {
        display: none;
      }
    
      /* sidebar ad after question */
      ._2uru > a:first-child {
        display: none;
      }
    `,
    recommended: `
      body::-webkit-scrollbar {
        display: none;
      }
    `,
  },
  twitter: {
    styles: `
    `,
    ads: `
    `,
    recommended: `
    `,
  },
};
