/* ====================================================
   i18n.js – German / English language support
   Handles translations and dynamic project rendering.
==================================================== */
(function () {
  'use strict';

  var LANG_KEY = 'ts_lang';
  var currentLang = 'de';
  var activeFilter = null;        // null = All; resets to null on every page load
  var activeFilterIsGroup = false; // true when activeFilter is a filterGroups key
  var overflowExpanded = false;    // true when rare (1-project) individual buttons are shown
  var activeDomainFilter = null;   // null = All domains

  /* ====================================================
     TRANSLATIONS
  ==================================================== */
  var translations = {
    en: {
      /* --- Navigation --- */
      'nav.home':     'Home',
      'nav.about':    'About',
      'nav.projects': 'Projects',
      'nav.contact':  'Contact',

      /* --- Index page --- */
      'index.badge':         '💼 Available for freelance projects',
      'index.hero.title':    'Hi, I\'m <span class="highlight">Thomas Schulze</span><br />Software Engineer',
      'index.hero.subtitle': 'I build scalable, architecture-first solutions that put user value at the centre – from microservice APIs and serverless cloud functions to modern web frontends. Let\'s turn your idea into reality.',
      'index.btn.projects':  '📁 View My Work',
      'index.btn.contact':   '✉️ Get in Touch',
      'index.prop1.title':   'Goal-Oriented',
      'index.prop1.text':    'I focus on delivering value, not just code. Your business goals drive every technical decision.',
      'index.prop2.title':   'Clean Code',
      'index.prop2.text':    'Readable, maintainable, and well-tested software that your team can build on confidently.',
      'index.prop3.title':   'Clear Communication',
      'index.prop3.text':    'Regular updates, transparent progress, and plain-language explanations throughout the project.',
      'index.prop4.title':   'On-Time Delivery',
      'index.prop4.text':    'Structured planning and agile iterations to keep your project on schedule and within budget.',

      /* --- About page --- */
      'about.label':         'About Me',
      'about.title':         'The engineer behind the solutions',
      'about.desc':          'Passionate about building software that makes a difference.',
      'about.role':          'Freelance Software Engineer',
      'about.location':      '📍 Europe (Remote) · Leipzig',
      'about.hire':          'Hire Me',
      'about.hello':         'Hello there! 👋',
      'about.bio1':          'I\'m Thomas – a freelance software engineer and architect based in Germany. My passion is building extensible solutions that stand out through their architecture and user experience, whether that means well-documented microservice REST APIs or event-driven serverless architectures in the cloud.',
      'about.bio2':          'Delivering the greatest possible value to users is always my top priority. I achieve this through short feedback loops and established DevOps practices. Continuous knowledge exchange, improving processes within and outside agile teams, Clean Code, and architecture topics are a central part of how I work every day.',
      'about.bio3':          'Technically I\'m at home in the Microsoft .NET ecosystem – C#, ASP.NET Core APIs, Hosted Services, Azure Functions, and AWS Lambdas. Frontend projects with Angular, React, and Blazor WASM have also sparked my enthusiasm for building mobile-first web experiences.',
      'about.stat1.label':   'Years Experience',
      'about.stat2.label':   'Projects Delivered',
      'about.stat3.label':   'Client Satisfaction',
      'about.skills.title':  'Technical Skills',
      'about.skills.desc':   'Technologies and tools I work with:',
      'about.offer.title':   'What I Offer',
      'about.offer.desc':    'As a freelancer I offer end-to-end software development services:',
      'about.offer.list':    '<li>Custom web application development (frontend &amp; backend)</li><li>REST API &amp; microservice architecture design and implementation</li><li>Legacy system modernisation and refactoring</li><li>Code reviews and technical consulting</li><li>Cloud deployment and DevOps (Azure, AWS)</li><li>Team augmentation for ongoing projects</li><li>Agile process coaching and Scrum facilitation</li>',

      /* --- Projects page --- */
      'projects.label':      'Portfolio',
      'projects.title':      'My Projects',
      'projects.desc':       'A selection of projects I\'ve worked on as a freelance software engineer.',
      'projects.desc.label': 'Project Description',
      'projects.role.label': 'My Role',
      'projects.tech.label': 'Technologies',
      'projects.present':    'present',
      'projects.cta.text':   'Have a project in mind? Let\'s build something great together.',
      'projects.cta.btn':    'Get in Touch →',
      'projects.filter.all': 'All',
      'projects.filter.toolbar.label': 'Filter by technology',
      'projects.filter.group.dotnet':        '.NET',
      'projects.filter.group.aspnet':        'ASP.NET',
      'projects.filter.group.azure':         'Azure',
      'projects.filter.group.sql':           'SQL',
      'projects.filter.group.frontend':      'Frontend',
      'projects.filter.group.apistandards':  'API / Standards',
      'projects.filter.group.cloudinfra':    'Cloud / Infra',
      'projects.filter.group.versioncontrol':'Version Control',
      'projects.filter.group.cicd':          'CI/CD',
      'projects.filter.group.alm':           'ALM / Tracking',
      'projects.filter.group.visualstudio':  'Visual Studio',
      'projects.filter.more':                'more',
      'projects.filter.less':                'Show less',
      'projects.filter.domain.toolbar.label': 'Filter by domain',
      'projects.filter.domain.all':           'All',
      'projects.filter.domain.backend':       'Backend',
      'projects.filter.domain.frontend':      'Frontend',
      'projects.filter.domain.cloudinfra':    'Cloud / Infra',
      'projects.filter.domain.architecture':  'Architecture',
      'projects.filter.domain.cxanalytics':   'CX / Analytics',

      /* --- Contact page --- */
      'contact.label':                   'Let\'s Talk',
      'contact.title':                   'Get in Touch',
      'contact.desc':                    'Have a project in mind or want to explore a collaboration? I\'d love to hear from you. I typically respond within one business day.',
      'contact.details.title':           'Contact Details',
      'contact.details.desc':            'Feel free to reach out via email or connect with me on LinkedIn or Freelancermap. I\'m open to freelance engagements, consulting, and contract work.',
      'contact.email.label':             'Email',
      'contact.location.label':          'Location',
      'contact.location.value':          'Europe (Remote), Leipzig Region (Remote & On-Site)',
      'contact.linkedin.profile':        'View Profile',
      'contact.freelancermap.profile':   'View Profile',
      'contact.available':               '✅ Currently Available',
      'contact.available.text':          'I\'m open to new freelance engagements. Let\'s talk about your project!',
      'contact.form.title':              'Send a Message',
      'contact.form.name.label':         'Name',
      'contact.form.name.placeholder':   'Your name',
      'contact.form.email.label':        'Email',
      'contact.form.email.placeholder':  'your@email.com',
      'contact.form.subject.label':      'Subject',
      'contact.form.subject.default':    'Select a topic…',
      'contact.form.subject.project':    'Project Inquiry',
      'contact.form.subject.consult':    'Consulting',
      'contact.form.subject.augment':    'Team Augmentation',
      'contact.form.subject.review':     'Code Review',
      'contact.form.subject.other':      'Other',
      'contact.form.message.label':      'Message',
      'contact.form.message.placeholder':'Tell me about your project or question…',
      'contact.form.submit':             'Send Message →',
      'contact.form.success.title':      'Email client opened!',
      'contact.form.success.text':       'Your email client should have opened with a pre-filled message. Please review and send it to reach me directly.',
      'contact.form.error':              'Failed – please try again',

      /* --- 404 page --- */
      'notfound.label':    'Error 404',
      'notfound.title':    'Page not found',
      'notfound.desc':     'The page you are looking for does not exist or has been moved.',
      'notfound.btn':      '← Back to Home',

      /* --- Footer --- */
      'footer.contact':     'Contact',
      'footer.impressum':   'Impressum',
      'footer.datenschutz': 'Privacy Policy',
    },

    de: {
      /* --- Navigation --- */
      'nav.home':     'Start',
      'nav.about':    'Über mich',
      'nav.projects': 'Projekte',
      'nav.contact':  'Kontakt',

      /* --- Index page --- */
      'index.badge':         '💼 Verfügbar für Freelance-Projekte',
      'index.hero.title':    'Hallo, ich bin <span class="highlight">Thomas Schulze</span><br />Software Engineer',
      'index.hero.subtitle': 'Ich entwickle skalierbare Lösungen mit Architektur- und UX-Fokus – von Microservice-APIs und serverlosen Cloud-Funktionen bis hin zu modernen Web-Frontends. Gemeinsam setzen wir Ihre Idee um.',
      'index.btn.projects':  '📁 Meine Projekte',
      'index.btn.contact':   '✉️ Kontakt aufnehmen',
      'index.prop1.title':   'Zielorientiert',
      'index.prop1.text':    'Ich konzentriere mich darauf, Mehrwert zu liefern – nicht nur Code. Ihre Geschäftsziele bestimmen jede technische Entscheidung.',
      'index.prop2.title':   'Clean Code',
      'index.prop2.text':    'Lesbarer, wartbarer und gut getesteter Code, auf dem Ihr Team aufbauen kann.',
      'index.prop3.title':   'Klare Kommunikation',
      'index.prop3.text':    'Regelmäßige Updates, transparenter Fortschritt und verständliche Erklärungen während des gesamten Projekts.',
      'index.prop4.title':   'Pünktliche Lieferung',
      'index.prop4.text':    'Strukturierte Planung und agile Iterationen, damit Ihr Projekt im Zeitplan und im Budget bleibt.',

      /* --- About page --- */
      'about.label':         'Über mich',
      'about.title':         'Der Ingenieur hinter den Lösungen',
      'about.desc':          'Leidenschaftlich dabei, Software zu entwickeln, die einen Unterschied macht.',
      'about.role':          'Freelance Software Engineer',
      'about.location':      '📍 Europa (Remote) · Region Leipzig',
      'about.hire':          'Jetzt anfragen',
      'about.hello':         'Hallo! 👋',
      'about.bio1':          'Ich bin Thomas – Freelance Software Engineer und Architekt aus Deutschland. Meine Leidenschaft gilt der Entwicklung von leicht erweiterbaren Lösungen, die durch ihre Architektur und User Experience überzeugen – sei es durch klar definierte und dokumentierte Microservice-REST-APIs oder event-getriebene serverlose Lösungen in der Cloud.',
      'about.bio2':          'Der größtmögliche Mehrwert für die Benutzer steht für mich immer an erster Stelle. Diesen Mehrwert liefere ich kontinuierlich durch kurze Feedbackschleifen und etablierte DevOps-Praktiken. Kontinuierlicher Wissensaustausch, die Verbesserung von Prozessen in und außerhalb agiler Teams sowie Clean Code und Architekturthemen sind feste Bestandteile meines täglichen Arbeitens.',
      'about.bio3':          'Technisch bin ich zuhause in der Microsoft .NET-Welt – C#, ASP.NET Core APIs, Hosted Services, Azure Functions und AWS Lambdas. Projekte mit Angular, React und Blazor WASM haben mich zudem für die Entwicklung moderner, Mobile-First-Webanwendungen begeistert.',
      'about.stat1.label':   'Jahre Erfahrung',
      'about.stat2.label':   'Projekte abgeliefert',
      'about.stat3.label':   'Kundenzufriedenheit',
      'about.skills.title':  'Technische Fähigkeiten',
      'about.skills.desc':   'Technologien und Werkzeuge, mit denen ich arbeite:',
      'about.offer.title':   'Mein Angebot',
      'about.offer.desc':    'Als Freelancer biete ich End-to-End Softwareentwicklungsdienstleistungen an:',
      'about.offer.list':    '<li>Entwicklung individueller Webanwendungen (Frontend &amp; Backend)</li><li>REST API &amp; Microservice-Architektur Design und Implementierung</li><li>Modernisierung und Refactoring von Legacy-Systemen</li><li>Code Reviews und technisches Consulting</li><li>Cloud-Deployment und DevOps (Azure, AWS)</li><li>Team-Augmentation für laufende Projekte</li><li>Agile Prozessberatung und Scrum-Facilitation</li>',

      /* --- Projects page --- */
      'projects.label':      'Portfolio',
      'projects.title':      'Meine Projekte',
      'projects.desc':       'Eine Auswahl an Projekten, an denen ich als Freelance Software Engineer gearbeitet habe.',
      'projects.desc.label': 'Projektbeschreibung',
      'projects.role.label': 'Meine Rolle',
      'projects.tech.label': 'Technologien',
      'projects.present':    'heute',
      'projects.cta.text':   'Haben Sie ein Projekt im Sinn? Lassen Sie uns gemeinsam etwas Großartiges entwickeln.',
      'projects.cta.btn':    'Kontakt aufnehmen →',
      'projects.filter.all': 'Alle',
      'projects.filter.toolbar.label': 'Nach Technologie filtern',
      'projects.filter.group.dotnet':        '.NET',
      'projects.filter.group.aspnet':        'ASP.NET',
      'projects.filter.group.azure':         'Azure',
      'projects.filter.group.sql':           'SQL',
      'projects.filter.group.frontend':      'Frontend',
      'projects.filter.group.apistandards':  'API / Standards',
      'projects.filter.group.cloudinfra':    'Cloud / Infra',
      'projects.filter.group.versioncontrol':'Versionsverwaltung',
      'projects.filter.group.cicd':          'CI/CD',
      'projects.filter.group.alm':           'ALM / Tracking',
      'projects.filter.group.visualstudio':  'Visual Studio',
      'projects.filter.more':                'mehr',
      'projects.filter.less':                'Weniger',
      'projects.filter.domain.toolbar.label': 'Nach Bereich filtern',
      'projects.filter.domain.all':           'Alle',
      'projects.filter.domain.backend':       'Backend',
      'projects.filter.domain.frontend':      'Frontend',
      'projects.filter.domain.cloudinfra':    'Cloud / Infra',
      'projects.filter.domain.architecture':  'Architektur',
      'projects.filter.domain.cxanalytics':   'CX / Analytics',

      /* --- Contact page --- */
      'contact.label':                   'Kontakt',
      'contact.title':                   'Kontaktieren Sie mich',
      'contact.desc':                    'Haben Sie ein Projekt im Sinn oder möchten Sie eine Zusammenarbeit erkunden? Ich freue mich von Ihnen zu hören. Ich antworte in der Regel innerhalb eines Werktages.',
      'contact.details.title':           'Kontaktdaten',
      'contact.details.desc':            'Kontaktieren Sie mich per E-Mail oder verbinden Sie sich mit mir auf LinkedIn oder Freelancermap. Ich bin offen für Freelance-Aufträge, Consulting und Projektarbeit.',
      'contact.email.label':             'E-Mail',
      'contact.location.label':          'Standort',
      'contact.location.value':          'Europa (Remote), Region Leipzig (Remote & Vor-Ort)',
      'contact.linkedin.profile':        'Profil anzeigen',
      'contact.freelancermap.profile':   'Profil anzeigen',
      'contact.available':               '✅ Aktuell verfügbar',
      'contact.available.text':          'Ich bin offen für neue Freelance-Aufträge. Lassen Sie uns über Ihr Projekt sprechen!',
      'contact.form.title':              'Nachricht senden',
      'contact.form.name.label':         'Name',
      'contact.form.name.placeholder':   'Ihr Name',
      'contact.form.email.label':        'E-Mail',
      'contact.form.email.placeholder':  'ihre@email.de',
      'contact.form.subject.label':      'Betreff',
      'contact.form.subject.default':    'Thema auswählen…',
      'contact.form.subject.project':    'Projektanfrage',
      'contact.form.subject.consult':    'Consulting',
      'contact.form.subject.augment':    'Team-Augmentation',
      'contact.form.subject.review':     'Code Review',
      'contact.form.subject.other':      'Sonstiges',
      'contact.form.message.label':      'Nachricht',
      'contact.form.message.placeholder':'Erzählen Sie mir von Ihrem Projekt oder Ihrer Frage…',
      'contact.form.submit':             'Nachricht senden →',
      'contact.form.success.title':      'E-Mail-Programm geöffnet!',
      'contact.form.success.text':       'Ihr E-Mail-Programm sollte sich mit einer vorausgefüllten Nachricht geöffnet haben. Bitte prüfen und senden Sie diese, um mich direkt zu erreichen.',
      'contact.form.error':              'Fehlgeschlagen – bitte erneut versuchen',

      /* --- 404 page --- */
      'notfound.label':    'Fehler 404',
      'notfound.title':    'Seite nicht gefunden',
      'notfound.desc':     'Die gesuchte Seite existiert nicht oder wurde verschoben.',
      'notfound.btn':      '← Zurück zur Startseite',

      /* --- Footer --- */
      'footer.contact':     'Kontakt',
      'footer.impressum':   'Impressum',
      'footer.datenschutz': 'Datenschutz',
    }
  };

  /* ====================================================
     PROJECT DATA
  ==================================================== */
  var projectsData = {
    en: [
      {
        id: 'fc274515-a2f6-4f3b-870d-d4c0c47891cb',
        title: 'Junior Software Consultant',
        description: '<p>Our client had a call center to receive listener opinions, sweepstakes participants, and other calls from listeners.<br />The project\'s task was to display categorized live caller information to known persons during a call (previous calls, previous winnings, spam, etc.) and to create appropriate data for new persons.<br />Furthermore, block lists should be able to be maintained as well as research and evaluations from the data stock should be possible.</p>',
        role: '<ul><li>Development of the web interface</li><li>Delivery of components</li><li>Testing of the components to be delivered</li><li>Requirements engineering with the customer</li></ul>',
        customerDomain: 'Broadcasting (Radio)',
        customerName: 'Drefa MSG',
        startDate: '2010-11-30',
        endDate: '2013-01-30',
        technologies: ['ASP.NET', 'JavaScript', '.NET Framework', 'TFS', 'C#'],
        domains: ['Frontend', 'Backend']
      },
      {
        id: 'fd075e8f-124f-44af-9a34-b12b91764614',
        title: 'Junior Software Consultant',
        description: '<p>A complex fat client application needed to be technologically updated. For this, the .NET Framework 2.0 used should be lifted to .NET Framework 4.0. This required corresponding analyses and subsequent adjustments to third-party components.</p>',
        role: '<ul><li>Analysis of the technical impacts of the migration</li><li>Implementation of the migration</li><li>Adjustments to the interface for the use of third-party components</li></ul>',
        customerDomain: 'Broadcasting',
        customerName: 'Drefa MSG',
        startDate: '2011-12-31',
        endDate: '2012-09-29',
        technologies: ['.NET Framework', 'C#', 'TFS'],
        domains: ['Backend']
      },
      {
        id: '3cd229c7-991c-4e1f-ab96-e38cbad9cc95',
        title: 'Junior Software Consultant',
        description: '<p>The basis was the necessity in the company\'s central product to export and import data. For this, an expandable client-server architecture was developed. With this, such a dynamic export or import could be carried out ad hoc and time-controlled.</p>',
        role: '<ul><li>Product management</li><li>Customer training</li><li>Implementation of the complete application</li><li>Architecture and theoretical preliminary work (bachelor thesis)</li></ul>',
        customerDomain: 'Broadcasting',
        customerName: 'Drefa MSG',
        startDate: '2012-12-31',
        endDate: '2015-03-30',
        technologies: ['WPF', 'WCF', '.NET Framework', 'C#', 'MEF', 'TFS'],
        domains: ['Backend', 'Architecture']
      },
      {
        id: '8e2df56b-69b1-4e66-ad63-459294ee1e31',
        title: 'Software Developer',
        description: '<p>A SAM solution was developed, including identification of the software installed on the customer\'s clients.<br />Part of the project was to provide the evaluations on a website with configurable dashboards.</p>',
        role: '<ul><li>Development of the dashboard (new KPIs, introduction of TypeScript and UnitTests)</li><li>Optimization of WPF components in client-server applications</li><li>Development of an engine based on code generation with Roslyn (C#) for executing freely definable rules</li></ul>',
        customerDomain: 'Software Licensing',
        customerName: 'COMPAREX AG',
        startDate: '2015-03-31',
        endDate: '2016-06-29',
        technologies: ['.NET Framework', 'C#', 'WPF', 'ASP.NET', 'JavaScript', 'TypeScript', 'SQL Server', 'Azure DevOps'],
        domains: ['Frontend', 'Backend', 'CX / Analytics']
      },
      {
        id: 'ca62f89b-0b8c-4f04-a774-1c77e1afff4d',
        title: 'Senior Software Engineer',
        description: '<p>The aim was to create a digital advisory process for OTC products. The process, as well as all individual steps, were configurable. The application was usable for different customers both in terms of interface and configuration.</p>',
        role: '<ul><li>Development of components in ASP.NET and Angular 2</li><li>Driving test-driven development</li><li>Stand-in for Scrum Master and team leader</li><li>Setup and maintenance of the CI/CD pipeline with VSTS (Azure DevOps)</li></ul>',
        customerDomain: 'Finance',
        customerName: 'Lucht Probst Associates GmbH',
        startDate: '2016-06-30',
        endDate: '2018-07-30',
        technologies: ['ASP.NET', '.NET Framework', 'C#', 'git', 'Angular', 'TypeScript', 'REST', 'Azure DevOps', 'Miro'],
        domains: ['Frontend', 'Backend', 'Architecture']
      },
      {
        id: 'f8b79d7f-59bd-4b2f-acef-f47a505d56a4',
        title: 'Senior Software Developer',
        description: '<p>A web shop was developed for a customer. In my area, overarching components were developed for this purpose (header, footer, cookie banner, etc.). The components and services were embedded in a microservice and micro-frontend infrastructure.</p>',
        role: '<ul><li>Development of ASP.NET Core Web APIs</li><li>Introducing the team to processes for continuous improvement</li><li>Architecture of the services and their interaction</li><li>Monitoring of agile processes or agile process artifacts in the team</li><li>Preparing and leading retrospectives and planning</li></ul>',
        customerDomain: 'eCommerce',
        customerName: 'CID GmbH',
        startDate: '2018-07-31',
        endDate: '2020-12-30',
        technologies: ['ASP.NET Core', '.NET', 'C#', 'git', 'React', 'TypeScript', 'TDD', 'Jira', 'Bitbucket', 'Octopus', 'TeamCity', 'Miro'],
        domains: ['Frontend', 'Backend', 'Architecture', 'Cloud / Infra']
      },
      {
        id: '4344b7a4-1452-48d7-aa38-5011eb8a80d5',
        title: 'Project Management for AB Tests in a Europe-wide Online Shop',
        description: '<p>The customer\'s website was to carry out AB tests using a solution for Conversion Rate Optimisation. Part of the project was the evaluation of a suitable solution, the GDPR-compliant introduction of this solution into the web shop and the training of developers and QA engineers. Also the development of AB tests themselves was part of the project.</p><p>The individual tasks were:</p><ul><li>Evaluating CRO solutions</li><li>Introduction of the CRO solution in the web shop (planning + development)</li><li>Training of developers and QA engineers on the found CRO solution</li><li>Development of AB tests</li><li>Delivery and monitoring of tests and trackings</li></ul>',
        role: '<p>Project Management and Development</p>',
        customerDomain: 'eCommerce',
        customerName: 'CID GmbH',
        startDate: '2018-07-31',
        endDate: '2020-12-30',
        technologies: ['JavaScript', 'ABTasty', 'git', 'Jira', 'Bitbucket', 'Octopus', 'TeamCity'],
        domains: ['Frontend', 'CX / Analytics']
      },
      {
        id: 'bf825263-df0d-4fd4-8d68-a548dc79b604',
        title: 'Chapter Lead Agile Processes',
        description: '<p>A chapter is a cross-team, theme-specific group of people. The aim of the chapter is to expand their own knowledge on a topic and carry it into their teams. Another goal is to establish standards or guard rails across all teams. The goal of the Agile Processes Chapter was exactly these points for agile development and continuous improvement within the teams.</p>',
        role: '<ul><li>Organize and lead chapter meetings</li><li>Prepare and introduce topics into the chapter</li><li>Introduce the worked out topics into my own team</li></ul>',
        customerDomain: 'eCommerce',
        customerName: 'CID GmbH',
        startDate: '2019-02-28',
        endDate: '2020-12-30',
        technologies: ['Miro', 'Jira'],
        domains: ['Architecture']
      },
      {
        id: '69159377-01c8-4b64-9e1c-5d1902e35030',
        title: 'Co-Founder and Lead API Council',
        description: '<p>APIs are the backbone of modern software landscapes. In order to achieve the lowest possible costs for the technical onboarding of individual APIs and overall a uniform Developer Experience across all public APIs, a uniform set of rules and a controlling instance was needed. That was the API Council.</p>',
        role: '<ul><li>Organization of regular Council Meetings</li><li>Development of ideas to improve the rule set of the APIs</li><li>Bringing the technical perspective into the Council. Informing about technical possibilities in the company\'s DevOps strategy</li><li>Active review of APIs from all teams</li></ul>',
        customerDomain: 'Software Portfolio Management & Licensing',
        customerName: 'SoftwareONE AG',
        startDate: '2020-03-31',
        endDate: '2023-02-27',
        technologies: ['OpenAPI 3', 'Azure DevOps', 'git', 'Miro', 'Spectral', 'REST', 'Swagger', 'YAML'],
        domains: ['Backend', 'Architecture']
      },
      {
        id: '37d0d0e0-21af-4cfb-8ecc-7ba37ee60497',
        title: 'Planning / Architecture of an API Management Solution',
        description: '<p>API management solutions as SaaS solutions, such as Azure API Management Service or AWS API Management, serve as a central access point for communication via APIs (WebAPIs, REST, gRPC, etc). To support multiple environments and for easy editing and use of these APIs, a custom solution was developed based on the Azure API Management Service.</p>',
        role: '<ul><li>Collecting, organizing, and prioritizing the requirements of all stakeholders</li><li>Planning the solution</li><li>Creating User Journey Maps, Epics, Features, User Stories</li><li>Representing the team in PI Plannings and other meetings</li></ul>',
        customerDomain: 'Software Portfolio Management & Licensing',
        customerName: 'SoftwareONE AG',
        startDate: '2020-09-30',
        endDate: '2023-02-27',
        technologies: ['Target Process', 'Azure DevOps', 'Azure', 'Miro'],
        domains: ['Cloud / Infra', 'Architecture']
      },
      {
        id: '5eed78cc-5c59-4046-98aa-bc7ce0ad701a',
        title: 'Development / Architecture of an Integration Platform',
        description: '<p>The communication between various domains and services is to be facilitated with a central platform. The focus is on hosting web APIs and the transport of messages. Important communication components for global systems should also be located in the Integration Platform. In addition to the solutions provided, the IP should also serve as a knowledge sharer and pioneer for new technical ideas.</p>',
        role: '<ul><li>Design and architecture of a hybrid cloud solution (Azure and AWS)</li><li>Technical coordination with consumers or providers of APIs</li><li>Design of OpenAPI 3 REST interfaces</li><li>Prototypical development of new ideas</li></ul>',
        customerDomain: 'Software Portfolio Management & Licensing',
        customerName: 'SoftwareONE AG',
        startDate: '2020-12-31',
        endDate: '2023-02-27',
        technologies: ['.NET', 'ASP.NET Core', 'Azure', 'API Management', 'AWS', 'C#', 'git', 'Terraform', 'REST', 'Messaging', 'Azure DevOps', 'Auth0', 'Target Process', 'ServiceNow'],
        domains: ['Backend', 'Cloud / Infra', 'Architecture']
      },
      {
        id: '7f34bc9c-0e46-485b-baff-6d045db34a8c',
        title: 'Senior Software Engineer',
        description: '<p>Development of microservices for the management and processing of master data for metering within a large enterprise system in the energy industry.<br />The focus was on processing and clearing incoming master data from various sources.</p><p>The system is part of a comprehensive platform supporting key business processes in the energy market, developed in parallel by multiple teams.</p>',
        role: '<ul><li>Planning and development of microservices based on Clean Architecture and Domain Driven Design</li><li>Development of a dynamically extensible clearing system for processing incoming master data</li><li>Training in modern programming and C# language concepts</li><li>Facilitator for team retrospectives</li></ul>',
        customerDomain: 'Energy Sector',
        customerName: 'Groß, Weber & Partner',
        startDate: '2023-01-01',
        endDate: '2025-08-31',
        technologies: ['.NET Framework', '.NET 6', '.NET 8', 'NHibernate', 'PowerShell', 'Azure DevOps', 'Jenkins', 'MS SQL Server', 'Visual Studio', 'Visual Studio Code'],
        domains: ['Backend', 'Architecture']
      },
      {
        id: '541e6958-2258-49fc-ad29-f520f63fa576',
        title: 'Senior Software Engineer – Platform Team',
        description: '<p>Working in a central platform team within a large enterprise system in the energy industry.<br />The team\'s goal is the technical advancement of the platform and improving the development speed of the domain teams.</p><p>Key areas include the modernisation of the system landscape (migration from .NET Framework to .NET 8/10), the migration of the ORM technology from NHibernate 5.1 to 5.5, and the development of developer tools to support the teams.</p>',
        role: '<ul><li>Migration of projects and NuGet packages across multiple teams from NHibernate 5.1 to NHibernate 5.5</li><li>Migration of a central ORM technology including adaptations to build tooling and development workflows</li><li>Development and maintenance of a Visual Studio extension for generating mapping code</li><li>Contributing to a central platform team for cross-team developer tooling</li><li>Facilitator for team retrospectives</li></ul>',
        customerDomain: 'Energy Sector (Platform Team)',
        customerName: 'Groß, Weber & Partner',
        startDate: '2025-08-01',
        technologies: ['.NET Framework', '.NET 8', '.NET 10', 'NHibernate', 'PowerShell', 'Azure DevOps', 'Jenkins', 'Visual Studio', 'Visual Studio Code'],
        domains: ['Backend', 'Architecture']
      }
    ],

    de: [
      {
        id: 'fc274515-a2f6-4f3b-870d-d4c0c47891cb',
        title: 'Junior Software Consultant',
        description: '<p>Unser Kunde hatte ein Callcenter, um Hörermeinungen, Gewinnspielteilnehmer und sonstige Anrufe von Hörern entgegenzunehmen.<br />Aufgabe des Projektes war es Anruferinformationen zu bekannten Personen während eines Anrufes kategorisiert live anzuzeigen (bisherige Anrufe, bisherige Gewinne, Spam, etc.) und für neue Personen entsprechende Daten anzulegen.<br />Weiterhin sollten Blocklisten gepflegt werden können sowie Recherche und Auswertungen aus dem Datenbestand möglich sein.</p>',
        role: '<ul><li>Entwicklung der Weboberfläche</li><li>Auslieferung der Komponenten</li><li>Test der auszuliefernden Komponenten</li><li>Requirementsengineering beim Kunden</li></ul>',
        customerDomain: 'Hörfunk',
        customerName: 'Drefa MSG',
        startDate: '2010-11-30',
        endDate: '2013-01-30',
        technologies: ['ASP.NET', 'JavaScript', '.NET Framework', 'TFS', 'C#'],
        domains: ['Frontend', 'Backend']
      },
      {
        id: 'fd075e8f-124f-44af-9a34-b12b91764614',
        title: 'Junior Software Consultant',
        description: '<p>Eine komplexe Fat-Client Anwendung sollte technologisch auf den neuesten Stand gebracht werden. Dafür sollte das genutzte .NET Framework 2.0 auf .NET Framework 4.0 gehoben werden. Dafür notwendig waren entsprechende Analysen und in Folge Anpassungen an Third-Party Komponenten.</p>',
        role: '<ul><li>Analyse der technischen Auswirkungen der Migration</li><li>Durchführung der Migration</li><li>Anpassungen an der Schnittstelle zur Nutzung von Third-Party Komponenten</li></ul>',
        customerDomain: 'Rundfunk',
        customerName: 'Drefa MSG',
        startDate: '2011-12-31',
        endDate: '2012-09-29',
        technologies: ['.NET Framework', 'C#', 'TFS'],
        domains: ['Backend']
      },
      {
        id: '3cd229c7-991c-4e1f-ab96-e38cbad9cc95',
        title: 'Junior Software Consultant',
        description: '<p>Grundlage war die Notwendigkeit in dem zentralen Produkt der Firma, Daten zu ex- und importieren. Dafür wurde eine erweiterbare Client-Server Architektur entwickelt. Mit dieser konnte ad-hoc und zeitgesteuert ein solcher dynamischer Ex- oder Import durchgeführt werden.</p>',
        role: '<ul><li>Produktmanagement</li><li>Schulungen der Kunden</li><li>Implementierung der kompletten Anwendung</li><li>Architektur und theoretische Vorarbeit (Bachelorarbeit)</li></ul>',
        customerDomain: 'Rundfunk',
        customerName: 'Drefa MSG',
        startDate: '2012-12-31',
        endDate: '2015-03-30',
        technologies: ['WPF', 'WCF', '.NET Framework', 'C#', 'MEF', 'TFS'],
        domains: ['Backend', 'Architecture']
      },
      {
        id: '8e2df56b-69b1-4e66-ad63-459294ee1e31',
        title: 'Software Developer',
        description: '<p>Entwickelt wurde eine SAM Lösung inkl. Identifizierung der installierten Software auf den Clients der Kunden.<br />Teil des Projektes war die Bereitstellung der Auswertungen auf einer Webseite mit konfigurierbaren Dashboards.</p>',
        role: '<ul><li>Entwicklung des Dashboards (neue KPIs, Einführung TypeScript und UnitTests)</li><li>Optimierung von WPF Komponenten in Client-Server Anwendungen</li><li>Entwicklung einer auf Codegenerierung mit Roslyn (C#) basierenden Engine zur Ausführung von frei definierbaren Regeln</li></ul>',
        customerDomain: 'Softwarelizenzierung',
        customerName: 'COMPAREX AG',
        startDate: '2015-03-31',
        endDate: '2016-06-29',
        technologies: ['.NET Framework', 'C#', 'WPF', 'ASP.NET', 'JavaScript', 'TypeScript', 'SQL Server', 'Azure DevOps'],
        domains: ['Frontend', 'Backend', 'CX / Analytics']
      },
      {
        id: 'ca62f89b-0b8c-4f04-a774-1c77e1afff4d',
        title: 'Senior Software Engineer',
        description: '<p>Ziel war die Erstellung eines digitalen Beratungsprozesses für OTC Produkte. Der Prozess, sowie alle einzelnen Schritte waren konfigurierbar. Die Anwendung war sowohl in der Oberfläche, als auch der Konfiguration für verschiedene Kunden nutzbar.</p>',
        role: '<ul><li>Entwicklung von Komponenten in ASP.NET und Angular 2</li><li>Treiben der testgetriebenen Entwicklung</li><li>Vertretung für Scrum Master und Teamleiter</li><li>Aufbau und Pflege der CI/CD Pipeline mit VSTS (Azure DevOps)</li></ul>',
        customerDomain: 'Finanzwesen',
        customerName: 'Lucht Probst Associates GmbH',
        startDate: '2016-06-30',
        endDate: '2018-07-30',
        technologies: ['ASP.NET', '.NET Framework', 'C#', 'git', 'Angular', 'TypeScript', 'REST', 'Azure DevOps', 'Miro'],
        domains: ['Frontend', 'Backend', 'Architecture']
      },
      {
        id: 'f8b79d7f-59bd-4b2f-acef-f47a505d56a4',
        title: 'Senior Software Developer',
        description: '<p>Für einen Kunden wurde ein Webshop entwickelt. In meinem Bereich wurden übergreifende Komponenten dafür entwickelt (Header, Footer, Cookie-Banner, etc.). Eingebettet wurden die Komponenten und Services in eine Microservice und Micro-Frontend Infrastruktur.</p>',
        role: '<ul><li>Entwicklung von ASP.NET Core Web APIs</li><li>Heranführung des Teams an Prozesse zur kontinuierlichen Verbesserung</li><li>Architektur der Services und deren Zusammenspiel</li><li>Überwachung von agilen Prozessen bzw. von agilen Prozessartefakten im Team</li><li>Vorbereiten und Leiten von Retrospektiven und Planungen</li></ul>',
        customerDomain: 'eCommerce',
        customerName: 'CID GmbH',
        startDate: '2018-07-31',
        endDate: '2020-12-30',
        technologies: ['ASP.NET Core', '.NET', 'C#', 'git', 'React', 'TypeScript', 'TDD', 'Jira', 'Bitbucket', 'Octopus', 'TeamCity', 'Miro'],
        domains: ['Frontend', 'Backend', 'Architecture', 'Cloud / Infra']
      },
      {
        id: '4344b7a4-1452-48d7-aa38-5011eb8a80d5',
        title: 'Projektleitung für AB Tests in einem europaweiten Onlineshop',
        description: '<p>Auf der Webseite des Kunden sollte mit Hilfe einer Lösung zur Conversion Rate Optimisation AB Tests durchgeführt werden. Teil des Projektes war die Evaluation einer passenden Lösung, die DSGVO-gerechte Einführung dieser Lösung in den Webshop und die Schulung der Entwickler/-innen und QS-Ingenieur/-innen. Auch die Entwicklung von AB Tests selbst war Teil des Projektes.</p><p>Die einzelnen Aufgaben waren dabei:</p><ul><li>CRO Lösungen evaluieren</li><li>Einführung der CRO Lösung in den Webshop (Planung + Entwicklung)</li><li>Schulung von Entwickler/-innen und QS-Ingenieur/-innen auf die gefundene CRO Lösung</li><li>Entwicklung von AB Tests</li><li>Auslieferung und Überwachung von Tests und Trackings</li></ul>',
        role: '<p>Projektleitung und Entwicklung</p>',
        customerDomain: 'eCommerce',
        customerName: 'CID GmbH',
        startDate: '2018-07-31',
        endDate: '2020-12-30',
        technologies: ['JavaScript', 'ABTasty', 'git', 'Jira', 'Bitbucket', 'Octopus', 'TeamCity'],
        domains: ['Frontend', 'CX / Analytics']
      },
      {
        id: 'bf825263-df0d-4fd4-8d68-a548dc79b604',
        title: 'Chapter Lead Agile Processes',
        description: '<p>Ein Chapter ist eine teamübergreifende themenspezifische Gruppe von Personen. Diese versuchen im Chapter ihr eigenes Wissen zu einem Thema zu erweitern und dieses in ihre Teams zu tragen. Ein weiteres Ziel ist das Etablieren von Standards bzw. Guard Rails über alle Teams hinweg. Das Ziel des Agile Processes Chapter waren genau die genannten Punkte für die agile Entwicklung und kontinuierliche Verbesserung innerhalb der Teams.</p>',
        role: '<ul><li>Organisieren und Leiten von Chapter Meetings</li><li>Vorbereiten und Einbringen von Themen in das Chapter</li><li>Einbringen der erarbeiteten Themen in mein eigenes Team</li></ul>',
        customerDomain: 'eCommerce',
        customerName: 'CID GmbH',
        startDate: '2019-02-28',
        endDate: '2020-12-30',
        technologies: ['Miro', 'Jira'],
        domains: ['Architecture']
      },
      {
        id: '69159377-01c8-4b64-9e1c-5d1902e35030',
        title: 'Mitgründer und Lead API Council',
        description: '<p>APIs sind das Rückgrat von modernen Softwarelandschaften. Um möglichst geringe Kosten für das technische Onboarding einzelner APIs zu erreichen und insgesamt eine einheitliche Developer Experience über alle öffentlichen APIs herzustellen, wurde ein einheitliches Regelwerk und eine kontrollierende Instanz gebraucht. Das war das API Council.</p>',
        role: '<ul><li>Organisation von regelmäßigen Council Meetings</li><li>Entwickeln von Ideen zur Verbesserung des Regelwerkes der APIs</li><li>Einbringen der technischen Sicht in das Council. Informieren über technische Möglichkeiten in der DevOps-Strategie des Unternehmens</li><li>Aktives Review von APIs von allen Teams</li></ul>',
        customerDomain: 'Software-Portfolio-Management und Software-Lizenzierung',
        customerName: 'SoftwareONE AG',
        startDate: '2020-03-31',
        endDate: '2023-02-27',
        technologies: ['OpenAPI 3', 'Azure DevOps', 'git', 'Miro', 'Spectral', 'REST', 'Swagger', 'YAML'],
        domains: ['Backend', 'Architecture']
      },
      {
        id: '37d0d0e0-21af-4cfb-8ecc-7ba37ee60497',
        title: 'Planung/Architektur einer API Management Lösung',
        description: '<p>API Managementlösungen als SaaS Lösung, wie der Azure API Management Service oder AWS API Management, dienen als zentraler Zugriffspunkt für die Kommunikation über APIs (WebAPIs, REST, gRPC, etc). Zur Unterstützung von mehreren Umgebungen sowie zur einfachen Bearbeitung und Nutzung dieser APIs wurde auf Basis des Azure API Management Service eine eigene Lösung entwickelt.</p>',
        role: '<ul><li>Sammeln, organisieren und priorisieren der Anforderungen von allen Stakeholdern</li><li>Planung der Lösung</li><li>Erstellen von User Journey Maps, Epics, Features, User Stories</li><li>Vertretung des Teams in PI Plannings und anderen Meetings</li></ul>',
        customerDomain: 'Software-Portfolio-Management und Software-Lizenzierung',
        customerName: 'SoftwareONE AG',
        startDate: '2020-09-30',
        endDate: '2023-02-27',
        technologies: ['Target Process', 'Azure DevOps', 'Azure', 'Miro'],
        domains: ['Cloud / Infra', 'Architecture']
      },
      {
        id: '5eed78cc-5c59-4046-98aa-bc7ce0ad701a',
        title: 'Entwicklung/Architektur einer Integrationsplattform',
        description: '<p>Die Kommunikation zwischen verschiedenen Domänen und Services soll mit einer zentralen Plattform ermöglicht werden. Dabei stehen das Hosting von Web APIs und der Transport von Messages im Fokus. Auch sollen wichtige Kommunikationskomponenten zu globalen Systemen in der Integration Platform angesiedelt sein. Neben den bereitgestellten Lösungen soll die IP auch als Wissensteiler und Vorreiter für neue technische Ideen dienen.</p>',
        role: '<ul><li>Design und Architektur einer hybriden Cloud-Lösung (Azure und AWS)</li><li>Technische Abstimmung mit Konsumenten bzw. Anbietern von APIs</li><li>Design von OpenAPI 3 REST-Schnittstellen</li><li>Prototypische Entwicklung von neuen Ideen</li></ul>',
        customerDomain: 'Software-Portfolio-Management und Software-Lizenzierung',
        customerName: 'SoftwareONE AG',
        startDate: '2020-12-31',
        endDate: '2023-02-27',
        technologies: ['.NET', 'ASP.NET Core', 'Azure', 'API Management', 'AWS', 'C#', 'git', 'Terraform', 'REST', 'Messaging', 'Azure DevOps', 'Auth0', 'Target Process', 'ServiceNow'],
        domains: ['Backend', 'Cloud / Infra', 'Architecture']
      },
      {
        id: '7f34bc9c-0e46-485b-baff-6d045db34a8c',
        title: 'Senior Software Engineer',
        description: '<p>Entwicklung von Microservices zur Verwaltung und Verarbeitung von Stammdaten des Messwesens innerhalb eines großen Enterprise-Systems der Energiewirtschaft.<br />Im Fokus stand die Verarbeitung und das Clearing eingehender Stammdaten aus verschiedenen Quellen.</p><p>Das System ist Teil einer umfangreichen Plattform zur Unterstützung zentraler Geschäftsprozesse im Energiemarkt und wird von mehreren Teams parallel weiterentwickelt.</p>',
        role: '<ul><li>Planung und Entwicklung von Microservices auf Basis von Clean Architecture und Domain Driven Design</li><li>Entwicklung eines dynamisch erweiterbaren Clearingsystems zur Verarbeitung eingehender Stammdaten</li><li>Schulung von modernen Programmier- und C#-Sprachkonzepten</li><li>Facilitator für Team-Retrospektiven</li></ul>',
        customerDomain: 'Energiewirtschaft',
        customerName: 'Groß, Weber & Partner',
        startDate: '2023-01-01',
        endDate: '2025-08-31',
        technologies: ['.NET Framework', '.NET 6', '.NET 8', 'NHibernate', 'PowerShell', 'Azure DevOps', 'Jenkins', 'MS SQL Server', 'Visual Studio', 'Visual Studio Code'],
        domains: ['Backend', 'Architecture']
      },
      {
        id: '541e6958-2258-49fc-ad29-f520f63fa576',
        title: 'Senior Software Engineer – Platform Team',
        description: '<p>Arbeit in einem zentralen Platform Team innerhalb eines großen Enterprise-Systems der Energiewirtschaft.<br />Ziel des Teams ist die technische Weiterentwicklung der Plattform sowie die Verbesserung der Entwicklungsgeschwindigkeit der Fachteams.</p><p>Schwerpunkte sind die Modernisierung der Systemlandschaft (Migration von .NET Framework auf .NET 8/10), die Migration der ORM-Technologie von NHibernate 5.1 auf 5.5 sowie die Entwicklung von Entwicklerwerkzeugen zur Unterstützung der Teams.</p>',
        role: '<ul><li>Migration von Projekten und NuGet-Packages über mehrere Teams von NHibernate 5.1 auf NHibernate 5.5</li><li>Migration einer zentralen ORM-Technologie inklusive Anpassungen an Build-Tooling und Entwicklungsworkflows</li><li>Entwicklung und Wartung einer Visual-Studio-Erweiterung zur Generierung von Mapping-Code</li><li>Mitarbeit in einem zentralen Platform Team für teamübergreifendes Developer-Tooling</li><li>Facilitator für Team-Retrospektiven</li></ul>',
        customerDomain: 'Energiewirtschaft (Platform Team)',
        customerName: 'Groß, Weber & Partner',
        startDate: '2025-08-01',
        technologies: ['.NET Framework', '.NET 8', '.NET 10', 'NHibernate', 'PowerShell', 'Azure DevOps', 'Jenkins', 'Visual Studio', 'Visual Studio Code'],
        domains: ['Backend', 'Architecture']
      }
    ]
  };

  /* ====================================================
     FILTER GROUPS
     Order here determines button render order.
  ==================================================== */
  var filterGroups = [
    { key: 'dotnet',         members: ['.NET Framework', '.NET', '.NET 6', '.NET 8', '.NET 10'] },
    { key: 'aspnet',         members: ['ASP.NET', 'ASP.NET Core'] },
    { key: 'azure',          members: ['Azure', 'Azure DevOps', 'API Management'] },
    { key: 'sql',            members: ['SQL Server', 'MS SQL Server'] },
    { key: 'frontend',       members: ['Angular', 'React', 'TypeScript', 'JavaScript'] },
    { key: 'apistandards',   members: ['REST', 'OpenAPI 3', 'Swagger', 'Spectral', 'YAML'] },
    { key: 'cloudinfra',     members: ['AWS', 'Terraform'] },
    { key: 'versioncontrol', members: ['git', 'TFS', 'Bitbucket'] },
    { key: 'cicd',           members: ['Jenkins', 'Octopus', 'TeamCity'] },
    { key: 'alm',            members: ['Jira', 'Target Process', 'ServiceNow'] },
    { key: 'visualstudio',   members: ['Visual Studio', 'Visual Studio Code'] }
  ];

  // Pipe (|) is the data-domains separator — domain values must not contain it
  var domainFilterOrder = ['Backend', 'Frontend', 'Cloud / Infra', 'Architecture', 'CX / Analytics'];

  /* ====================================================
     DOMAIN ICONS
  ==================================================== */
  var domainIcons = {
    'Broadcasting (Radio)':                                '📻',
    'Broadcasting':                                        '📺',
    'Hörfunk':                                             '📻',
    'Rundfunk':                                            '📺',
    'Software Licensing':                                  '🔑',
    'Softwarelizenzierung':                                '🔑',
    'Finance':                                             '💳',
    'Finanzwesen':                                         '💳',
    'eCommerce':                                           '🛒',
    'Software Portfolio Management & Licensing':           '🗂️',
    'Software-Portfolio-Management und Software-Lizenzierung': '🗂️',
    'Energy Sector':                                       '⚡',
    'Energy Sector (Platform Team)':                       '⚡',
    'Energiewirtschaft':                                   '⚡',
    'Energiewirtschaft (Platform Team)':                   '⚡'
  };

  function getIcon(domain) {
    return domainIcons[domain] || '💼';
  }

  /* ====================================================
     HTML ESCAPING (for text-only fields rendered into HTML)
  ==================================================== */
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /* ====================================================
     DATE FORMATTING
  ==================================================== */
  function formatDate(dateStr, lang) {
    var d = new Date(dateStr + 'T00:00:00Z');
    var locale = lang === 'de' ? 'de-DE' : 'en-GB';
    return d.toLocaleDateString(locale, { year: 'numeric', month: 'short', timeZone: 'UTC' });
  }

  /* ====================================================
     FILTER BUTTON RENDERING
  ==================================================== */
  function getActiveMembers() {
    if (activeFilter === null) return null;
    if (activeFilterIsGroup) {
      for (var i = 0; i < filterGroups.length; i++) {
        if (filterGroups[i].key === activeFilter) return filterGroups[i].members;
      }
      return null;
    }
    return [activeFilter];
  }

  function renderFilterButtons(lang) {
    var container = document.getElementById('projectsFilter');
    if (!container) return;

    var t = translations[lang];
    var projects = projectsData[lang];

    // Build set of all technologies used by at least one project
    var techSet = {};
    for (var i = 0; i < projects.length; i++) {
      var techs = projects[i].technologies;
      for (var j = 0; j < techs.length; j++) { techSet[techs[j]] = true; }
    }

    // Build lookup of tech -> group key (to exclude grouped techs from individual buttons)
    var techToGroupKey = {};
    for (var gi = 0; gi < filterGroups.length; gi++) {
      var group = filterGroups[gi];
      for (var mi = 0; mi < group.members.length; mi++) {
        techToGroupKey[group.members[mi]] = group.key;
      }
    }

    // "All" button
    var allLabel = t['projects.filter.all'];
    var html = '<button class="filter-btn' + (activeFilter === null ? ' is-active' : '') +
      '" data-filter="*" type="button">' + escapeHtml(allLabel) + '</button>';

    // Group buttons (defined order; skip groups with zero matching projects)
    for (var g = 0; g < filterGroups.length; g++) {
      var grp = filterGroups[g];
      var groupHasProjects = false;
      for (var gm = 0; gm < grp.members.length; gm++) {
        if (techSet[grp.members[gm]]) { groupHasProjects = true; break; }
      }
      if (!groupHasProjects) continue;

      var isGroupActive = activeFilterIsGroup && activeFilter === grp.key;
      var groupLabel = t['projects.filter.group.' + grp.key] || grp.key;
      html += '<button class="filter-btn filter-btn--group' + (isGroupActive ? ' is-active' : '') +
        '" data-filter-group="' + escapeHtml(grp.key) + '" type="button">' +
        escapeHtml(groupLabel) + '</button>';
    }

    // Individual buttons: techs not covered by any group, sorted alphabetically
    var individualTechs = [];
    for (var tech in techSet) {
      if (techSet.hasOwnProperty(tech) && !techToGroupKey[tech]) {
        individualTechs.push(tech);
      }
    }
    individualTechs.sort(function (a, b) { return a.localeCompare(b); });

    // Count how many projects use each individual tech (to split frequent vs rare)
    var techCount = {};
    for (var ci = 0; ci < projects.length; ci++) {
      var ctechs = projects[ci].technologies;
      for (var cj = 0; cj < ctechs.length; cj++) {
        var ct = ctechs[cj];
        if (!techToGroupKey[ct]) { techCount[ct] = (techCount[ct] || 0) + 1; }
      }
    }

    var frequentTechs = [];
    var rareTechs = [];
    for (var ii = 0; ii < individualTechs.length; ii++) {
      if ((techCount[individualTechs[ii]] || 0) >= 2) {
        frequentTechs.push(individualTechs[ii]);
      } else {
        rareTechs.push(individualTechs[ii]);
      }
    }

    // Auto-expand overflow if the active filter is a rare tech
    if (!activeFilterIsGroup && activeFilter !== null && rareTechs.indexOf(activeFilter) !== -1) {
      overflowExpanded = true;
    }

    // Frequent individual buttons (always visible)
    for (var fi = 0; fi < frequentTechs.length; fi++) {
      var freqTech = frequentTechs[fi];
      var isFreqActive = !activeFilterIsGroup && activeFilter === freqTech;
      html += '<button class="filter-btn' + (isFreqActive ? ' is-active' : '') +
        '" data-filter="' + escapeHtml(freqTech) + '" type="button">' + escapeHtml(freqTech) + '</button>';
    }

    // Rare individual buttons (overflow, hidden until expanded)
    for (var ri = 0; ri < rareTechs.length; ri++) {
      var rareTech = rareTechs[ri];
      var isRareActive = !activeFilterIsGroup && activeFilter === rareTech;
      html += '<button class="filter-btn filter-btn--overflow' + (isRareActive ? ' is-active' : '') +
        '" data-filter="' + escapeHtml(rareTech) + '" type="button">' + escapeHtml(rareTech) + '</button>';
    }

    // Toggle button (only when rare techs exist)
    if (rareTechs.length > 0) {
      var moreLabel = overflowExpanded
        ? t['projects.filter.less']
        : '+' + rareTechs.length + '\u00a0' + t['projects.filter.more'];
      html += '<button class="filter-btn filter-btn--toggle-overflow" type="button">' +
        escapeHtml(moreLabel) + '</button>';
    }

    container.setAttribute('aria-label', t['projects.filter.toolbar.label']);
    container.innerHTML = html;

    if (overflowExpanded) {
      container.setAttribute('data-overflow-expanded', '');
    } else {
      container.removeAttribute('data-overflow-expanded');
    }

    container.onclick = function (e) {
      var btn = e.target.closest('.filter-btn');
      if (!btn) return;

      // Overflow toggle button
      if (btn.classList.contains('filter-btn--toggle-overflow')) {
        if (overflowExpanded) {
          // Reset filter if it's a rare tech, then collapse
          if (!activeFilterIsGroup && activeFilter !== null && rareTechs.indexOf(activeFilter) !== -1) {
            activeFilter = null;
            activeFilterIsGroup = false;
          }
          overflowExpanded = false;
        } else {
          overflowExpanded = true;
        }
        renderFilterButtons(currentLang);
        applyFilter();
        return;
      }

      var groupKey = btn.getAttribute('data-filter-group');
      var filterVal = btn.getAttribute('data-filter');

      if (filterVal === '*') {
        activeFilter = null;
        activeFilterIsGroup = false;
      } else if (groupKey) {
        if (activeFilterIsGroup && activeFilter === groupKey) {
          activeFilter = null;
          activeFilterIsGroup = false;
        } else {
          activeFilter = groupKey;
          activeFilterIsGroup = true;
        }
      } else if (filterVal) {
        if (!activeFilterIsGroup && activeFilter === filterVal) {
          activeFilter = null;
          activeFilterIsGroup = false;
        } else {
          activeFilter = filterVal;
          activeFilterIsGroup = false;
        }
      }

      // Update is-active classes in place so keyboard focus is preserved
      var buttons = container.querySelectorAll('.filter-btn');
      for (var i = 0; i < buttons.length; i++) {
        var b = buttons[i];
        var bGroupKey = b.getAttribute('data-filter-group');
        var bFilter   = b.getAttribute('data-filter');
        var isActive = false;
        if (activeFilter === null) {
          isActive = (bFilter === '*');
        } else if (activeFilterIsGroup) {
          isActive = (bGroupKey === activeFilter);
        } else {
          isActive = (bFilter === activeFilter);
        }
        b.classList.toggle('is-active', isActive);
      }
      applyFilter();
    };
  }

  function renderDomainFilterButtons(lang) {
    var container = document.getElementById('projectsDomainFilter');
    if (!container) return;

    var t = translations[lang];

    var domainKeyMap = {
      'Backend':        'projects.filter.domain.backend',
      'Frontend':       'projects.filter.domain.frontend',
      'Cloud / Infra':  'projects.filter.domain.cloudinfra',
      'Architecture':   'projects.filter.domain.architecture',
      'CX / Analytics': 'projects.filter.domain.cxanalytics'
    };

    var allLabel = t['projects.filter.domain.all'];
    var html = '<button class="filter-btn' + (activeDomainFilter === null ? ' is-active' : '') +
      '" data-domain-filter="*" type="button">' + escapeHtml(allLabel) + '</button>';

    for (var i = 0; i < domainFilterOrder.length; i++) {
      var domain = domainFilterOrder[i];
      var label = t[domainKeyMap[domain]] || domain;
      var isActive = activeDomainFilter === domain;
      html += '<button class="filter-btn' + (isActive ? ' is-active' : '') +
        '" data-domain-filter="' + escapeHtml(domain) + '" type="button">' +
        escapeHtml(label) + '</button>';
    }

    container.setAttribute('aria-label', t['projects.filter.domain.toolbar.label']);
    container.innerHTML = html;

    container.onclick = function (e) {
      var btn = e.target.closest('.filter-btn');
      if (!btn) return;

      var domainVal = btn.getAttribute('data-domain-filter');
      if (domainVal === '*') {
        activeDomainFilter = null;
      } else if (domainVal) {
        if (activeDomainFilter === domainVal) {
          activeDomainFilter = null;
        } else {
          activeDomainFilter = domainVal;
        }
      }

      var buttons = container.querySelectorAll('.filter-btn');
      for (var i = 0; i < buttons.length; i++) {
        var b = buttons[i];
        var bVal = b.getAttribute('data-domain-filter');
        var isActive = activeDomainFilter === null ? (bVal === '*') : (bVal === activeDomainFilter);
        b.classList.toggle('is-active', isActive);
      }
      applyFilter();
    };
  }

  function applyFilter() {
    var grid = document.getElementById('projectsGrid');
    if (!grid) return;
    var activeMembers = getActiveMembers();
    var cards = grid.querySelectorAll('.project-card');
    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];

      // Tech axis
      var techMatch = true;
      if (activeMembers !== null) {
        var cardTechs = (card.getAttribute('data-technologies') || '').split('|');
        techMatch = false;
        for (var j = 0; j < cardTechs.length && !techMatch; j++) {
          for (var m = 0; m < activeMembers.length && !techMatch; m++) {
            if (cardTechs[j] === activeMembers[m]) techMatch = true;
          }
        }
      }

      // Domain axis
      var domainMatch = true;
      if (activeDomainFilter !== null) {
        var cardDomains = (card.getAttribute('data-domains') || '').split('|');
        domainMatch = cardDomains.indexOf(activeDomainFilter) !== -1;
      }

      card.classList.toggle('is-hidden', !(techMatch && domainMatch));
    }
  }

  /* ====================================================
     PROJECT RENDERING
  ==================================================== */
  function renderProjects(lang) {
    var grid = document.getElementById('projectsGrid');
    if (!grid) return;

    var t = translations[lang];
    var projects = projectsData[lang];

    // Sort by startDate descending (most recent first)
    var sorted = projects.slice().sort(function (a, b) {
      return new Date(b.startDate) - new Date(a.startDate);
    });

    var chevronSvg = '<svg class="project-toggle-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>';

    grid.innerHTML = sorted.map(function (p) {
      var start    = formatDate(p.startDate, lang);
      var end      = p.endDate ? formatDate(p.endDate, lang) : t['projects.present'];
      var icon     = getIcon(p.customerDomain);
      var safeId   = escapeHtml(p.id);
      var headerId = 'ph-' + safeId;
      var bodyId   = 'pb-' + safeId;

      return '<article class="project-card" id="pc-' + safeId + '"' +
        ' data-technologies="' + escapeHtml(p.technologies.join('|')) + '"' +
        ' data-domains="' + escapeHtml((p.domains || []).join('|')) + '">' +
        '<div class="project-card-header" id="' + headerId + '" role="button" tabindex="0" aria-expanded="false" aria-controls="' + bodyId + '">' +
          '<div class="project-card-header-info">' +
            '<div class="project-meta">' +
              '<div class="project-domain-row">' +
                '<span class="project-icon-sm" aria-hidden="true">' + icon + '</span>' +
                '<span class="project-domain-label">' + escapeHtml(p.customerDomain) + '</span>' +
                '<span class="project-customer-name">' + escapeHtml(p.customerName) + '</span>' +
              '</div>' +
              '<span class="project-period">' + escapeHtml(start) + ' \u2013 ' + escapeHtml(end) + '</span>' +
            '</div>' +
            '<h2 class="project-title">' + escapeHtml(p.title) + '</h2>' +
          '</div>' +
          chevronSvg +
        '</div>' +
        '<div class="project-card-body" id="' + bodyId + '" role="region" aria-labelledby="' + headerId + '">' +
          '<p class="project-section-label">' + escapeHtml(t['projects.desc.label']) + '</p>' +
          '<div class="project-desc">' + p.description + '</div>' +
          '<p class="project-section-label">' + escapeHtml(t['projects.role.label']) + '</p>' +
          '<div class="project-role">' + p.role + '</div>' +
          '<p class="project-section-label">' + escapeHtml(t['projects.tech.label']) + '</p>' +
          '<div class="project-tags">' +
            p.technologies.map(function (tech) {
              return '<span class="tag">' + escapeHtml(tech) + '</span>';
            }).join('') +
          '</div>' +
        '</div>' +
      '</article>';
    }).join('');

    // Set up accordion event delegation once (survives language switches via innerHTML reset)
    if (!grid.dataset.accordionReady) {
      grid.dataset.accordionReady = '1';

      function toggleCard(header) {
        var card = header.closest('.project-card');
        if (!card) return;
        var body = card.querySelector('.project-card-body');
        if (!body) return;
        var open = card.classList.toggle('is-open');
        header.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (open) {
          history.replaceState(null, '', '#' + card.id);
          body.style.maxHeight = body.scrollHeight + 'px';
        } else {
          history.replaceState(null, '', location.pathname);
          // Re-pin current height before collapsing; the inline style may have been
          // cleared by transitionend, leaving body unrestricted (max-height: none from CSS).
          body.style.maxHeight = body.scrollHeight + 'px';
          // Force a synchronous reflow so the browser sees the start value for the transition.
          // eslint-disable-next-line no-unused-expressions
          body.offsetHeight;
          body.style.maxHeight = '0';
        }
      }

      // Remove the inline max-height constraint once fully open so the body reflows
      // naturally on viewport resize (text reflow won't cause content clipping).
      grid.addEventListener('transitionend', function (e) {
        if (e.propertyName !== 'max-height') return;
        var body = e.target;
        if (!body.classList.contains('project-card-body')) return;
        var card = body.closest('.project-card');
        if (card && card.classList.contains('is-open')) {
          body.style.maxHeight = ''; // CSS .is-open rule (max-height: none) takes over
        }
      });

      grid.addEventListener('click', function (e) {
        var header = e.target.closest('.project-card-header');
        if (header) toggleCard(header);
      });

      grid.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          var header = e.target.closest('.project-card-header');
          if (header) { e.preventDefault(); toggleCard(header); }
        }
      });
    }

    // Open the card matching the URL hash, or fall back to the first (most recent) card
    var hashId = window.location.hash.slice(1); // e.g. "pc-abc123"
    var targetHeader = hashId
      ? grid.querySelector('#' + CSS.escape(hashId) + ' .project-card-header')
      : null;

    if (targetHeader) {
      var targetCard = targetHeader.closest('.project-card');
      var targetBody = targetCard && targetCard.querySelector('.project-card-body');
      if (targetCard && targetBody) {
        targetCard.classList.add('is-open');
        targetHeader.setAttribute('aria-expanded', 'true');
        targetBody.style.maxHeight = targetBody.scrollHeight + 'px';
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      var firstHeader = grid.querySelector('.project-card-header');
      if (firstHeader) {
        var firstCard = firstHeader.closest('.project-card');
        var firstBody = firstCard && firstCard.querySelector('.project-card-body');
        if (firstCard && firstBody) {
          firstCard.classList.add('is-open');
          firstHeader.setAttribute('aria-expanded', 'true');
          firstBody.style.maxHeight = firstBody.scrollHeight + 'px';
        }
      }
    }

    applyFilter();
  }

  /* ====================================================
     APPLY TRANSLATIONS
  ==================================================== */
  function applyTranslations(lang) {
    var t = translations[lang];

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (key in t) el.textContent = t[key];
    });

    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-html');
      if (key in t) el.innerHTML = t[key];
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-placeholder');
      if (key in t) el.placeholder = t[key];
    });

    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });

    document.documentElement.setAttribute('lang', lang);

    renderFilterButtons(lang);
    renderDomainFilterButtons(lang);
    renderProjects(lang);
  }

  /* ====================================================
     PUBLIC API
  ==================================================== */
  function setLanguage(lang) {
    currentLang = lang;
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
    applyTranslations(lang);
  }

  function initLanguage() {
    var lang = 'de';
    try { lang = localStorage.getItem(LANG_KEY) || 'de'; } catch (e) {}
    if (lang !== 'en' && lang !== 'de') lang = 'de';
    currentLang = lang;
    applyTranslations(lang);

    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setLanguage(btn.getAttribute('data-lang'));
      });
    });
  }

  document.addEventListener('DOMContentLoaded', initLanguage);

  window.i18n = {
    setLanguage: setLanguage,
    t: function (key) { return (translations[currentLang] && translations[currentLang][key]) || key; }
  };

}());
