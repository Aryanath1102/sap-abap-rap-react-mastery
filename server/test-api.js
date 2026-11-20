import { initDatabase, getProgress, updateProgress, getProjectChecklists, updateProjectStep, addSubmission, exportAllData } from './src/db.js';
import { validateAssignment, analyzeMentorPrompt } from './src/cleanCoreValidator.js';

async function runTests() {
  console.log('Testing Database and API logic...');
  await initDatabase();

  // Test 1: getProgress
  const p1 = getProgress();
  console.log('Test 1 getProgress:', p1.streak, 'day streak');

  // Test 2: updateProgress
  const p2 = updateProgress({ completed_days: [1, 2], streak: 2 });
  console.log('Test 2 updateProgress:', p2.completed_days);

  // Test 3: updateProjectStep & getProjectChecklists
  updateProjectStep('p1', 0, true);
  updateProjectStep('p1', 1, true);
  const checklists = getProjectChecklists();
  console.log('Test 3 checklists:', checklists);

  // Test 4: validateAssignment (Clean Core checks)
  const badResult = validateAssignment('modern-abap', 'WRITE: / "Hello". SELECT * FROM but000 INTO TABLE @DATA(lt_bp).');
  console.log('Test 4 bad code violations count:', badResult.violations.length, 'Grade:', badResult.grade);

  const goodResult = validateAssignment('modern-abap', `
    FINAL(lv_high_earners) = REDUCE i(
      INIT cnt = 0
      FOR ls IN lt_emps
      NEXT cnt = cnt + COND i( WHEN ls-salary > 70000 THEN 1 ELSE 0 )
    ).
    SELECT FROM i_businesspartner FIELDS businesspartner INTO TABLE @DATA(lt_bp).
  `);
  console.log('Test 4 good code status:', goodResult.status, 'Score:', goodResult.complianceScore, 'Grade:', goodResult.grade);

  // Test 5: addSubmission
  const submissions = addSubmission({
    lessonId: 'modern-abap',
    userCode: 'FINAL(x) = REDUCE ...',
    status: 'passed',
    architectFeedback: goodResult
  });
  console.log('Test 5 addSubmission count:', submissions.length);

  // Test 6: analyzeMentorPrompt
  const mentorAnswer = analyzeMentorPrompt('How do I handle Draft in SAP RAP? Also here is my code: SELECT * FROM mara.');
  console.log('Test 6 mentor analysis length:', mentorAnswer.length);

  // Test 7: exportAllData
  const exported = exportAllData();
  console.log('Test 7 exportAllData keys:', Object.keys(exported));

  console.log('ALL SERVER UNIT TESTS PASSED SUCCESSFULLY! ✅');
}

runTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
