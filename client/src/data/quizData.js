export const QUIZ_DATA = [
  {
    id: 'q1',
    category: 'Modern ABAP',
    question: 'Which modern ABAP keyword declares an immutable inline variable that cannot be modified after assignment (ABAP 7.57+)?',
    options: ['DATA(...)', 'FINAL(...)', 'CONSTANTS', 'IMMUTABLE(...)'],
    answer: 1,
    explanation: 'FINAL(...) was introduced in ABAP 7.57 / S/4HANA 2022 to declare immutable inline variables whose values cannot be reassigned, encouraging clean functional style.'
  },
  {
    id: 'q2',
    category: 'CDS Views',
    question: 'Why must you use DEFINE VIEW ENTITY instead of legacy DEFINE VIEW in modern SAP RAP applications?',
    options: [
      'DEFINE VIEW ENTITY runs on Oracle while DEFINE VIEW runs on HANA',
      'DEFINE VIEW ENTITY does not generate an SE11 SQL view, activates faster, and has strict compiler checks',
      'DEFINE VIEW ENTITY is only for classic Dynpros',
      'There is no difference between them'
    ],
    answer: 1,
    explanation: 'DEFINE VIEW ENTITY is DDIC-free (no SE11 SQL view is generated). It activates significantly faster, eliminates cyclic view generation errors, and is mandatory for modern RAP.'
  },
  {
    id: 'q3',
    category: 'RAP Architecture',
    question: 'What is the purpose of declaring `strict ( 2 );` in a RAP Behavior Definition (BDEF)?',
    options: [
      'It restricts the service to two users only',
      'It activates the most rigorous RAP compiler checks, enforces explicit mapping, and guarantees ABAP Cloud compliance',
      'It requires two database tables per entity',
      'It forces OData V2 compatibility mode'
    ],
    answer: 1,
    explanation: 'strict ( 2 ); is SAP’s latest strict mode for RAP BDEFs. It enforces explicit field mapping, mandatory authorization master declarations, and eliminates obsolete syntax.'
  },
  {
    id: 'q4',
    category: 'RAP Lifecycle',
    question: 'During which phase of the RAP transactional lifecycle do Validations execute?',
    options: [
      'During user typing in the React input box',
      'During ON SAVE (Save Sequence) before data is committed to the database',
      'Immediately after COMMIT WORK has finished',
      'Only when the user clicks Discard'
    ],
    answer: 1,
    explanation: 'Validations run ON SAVE. If any validation fails, it appends keys to `failed-entity` and messages to `reported-entity`, halting the commit and aborting the transaction.'
  },
  {
    id: 'q5',
    category: 'React & OData V4',
    question: 'Which HTTP method should a React application use for partial entity updates (delta changes) in OData V4?',
    options: ['PUT', 'PATCH', 'POST', 'UPDATE'],
    answer: 1,
    explanation: 'OData V4 mandates HTTP PATCH for updating modified fields. Sending only the changed attributes prevents unintentional overwrites and minimizes network payload.'
  },
  {
    id: 'q6',
    category: 'RAP EML',
    question: 'Why should you always specify `IN LOCAL MODE` when using EML inside a Behavior Pool implementation class?',
    options: [
      'To connect to localhost instead of the cloud',
      'To safely bypass external authorization and feature control checks for internal intra-BO operations',
      'To disable all database indexing',
      'To write directly to text files'
    ],
    answer: 1,
    explanation: 'IN LOCAL MODE informs the RAP kernel that the Business Object is reading or modifying its own transactional buffer, so external authorization and feature control checks should be bypassed.'
  },
  {
    id: 'q7',
    category: 'Clean Core',
    question: 'In SAP S/4HANA Cloud and Clean Core architecture, what replaces direct reads like `SELECT * FROM but000` or `SELECT * FROM mara`?',
    options: [
      'Direct FTP file downloads from the operating system',
      'Officially released Level A CDS View Entities such as I_BusinessPartner and I_Product',
      'Calling classic function modules via RFC',
      'Direct table reads in SE16N'
    ],
    answer: 1,
    explanation: 'Clean Core prohibits direct queries against unreleased standard SAP tables. Developers must use officially released Level A CDS View Entities (Contract C1) like I_BusinessPartner and I_Product.'
  },
  {
    id: 'q8',
    category: 'React & OData V4',
    question: 'Why must a React application fetch an `X-CSRF-Token` before sending a POST, PATCH, or DELETE request to SAP Gateway?',
    options: [
      'To choose which CSS stylesheet to load',
      'To satisfy SAP Gateway Cross-Site Request Forgery security protection on mutating HTTP requests',
      'To format numbers with commas',
      'To speed up network DNS lookups'
    ],
    answer: 1,
    explanation: 'SAP Gateway requires a valid cryptographic X-CSRF-Token on all state-changing HTTP requests (POST, PATCH, DELETE) to protect against CSRF attacks in authenticated sessions.'
  },
  {
    id: 'q9',
    category: 'RAP Draft',
    question: 'What is the role of the `PREPARE` action in a draft-enabled RAP Business Object?',
    options: [
      'It formats the hard drive before saving',
      'It executes the validations declared in `draft determine action Prepare` before promoting a draft to active data',
      'It deletes all draft records permanently',
      'It converts ABAP to JavaScript'
    ],
    answer: 1,
    explanation: 'The PREPARE action runs validations during draft activation. If all validations succeed, the draft instance is safely committed to the active database table.'
  },
  {
    id: 'q10',
    category: 'Modern ABAP',
    question: 'Which constructor expression is used to aggregate rows of an internal table into a single result (e.g. total salary or line item count)?',
    options: ['FILTER', 'CORRESPONDING', 'REDUCE', 'EXACT'],
    answer: 2,
    explanation: 'REDUCE iterates over an internal table, applying an expression across all rows to compute a single aggregated result (identical to Array.prototype.reduce in JavaScript).'
  }
];
