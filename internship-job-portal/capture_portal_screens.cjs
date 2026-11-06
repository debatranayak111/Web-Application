const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const browserPath = fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
  ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  : 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const screenshotsDir = path.resolve(__dirname, 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

async function capture() {
  console.log('Launching browser from:', browserPath);
  const browser = await puppeteer.launch({
    executablePath: browserPath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 960, deviceScaleFactor: 2 });

  const url = 'http://127.0.0.1:5000';
  console.log(`Navigating to ${url}...`);
  await page.goto(url, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));

  // 1. Browse Internships view
  console.log('Capturing 1: Browse Internships...');
  await page.screenshot({ path: path.join(screenshotsDir, 'screenshot_1_browse_internships.png'), fullPage: true });

  // 2. Open Job Detail Modal
  console.log('Capturing 2: Job Detail Modal...');
  const detailButtons = await page.$$('.job-card .btn-secondary');
  if (detailButtons.length > 0) {
    await detailButtons[0].click();
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: path.join(screenshotsDir, 'screenshot_2_job_details_modal.png') });
    // Close modal
    const closeBtn = await page.$('.modal-close-btn');
    if (closeBtn) await closeBtn.click();
    await new Promise(r => setTimeout(r, 400));
  }

  // 3. Open Apply Modal
  console.log('Capturing 3: Apply Modal...');
  const applyButtons = await page.$$('.job-card .btn-primary');
  if (applyButtons.length > 0) {
    await applyButtons[0].click();
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: path.join(screenshotsDir, 'screenshot_3_apply_modal.png') });
    const closeBtn = await page.$('.modal-close-btn');
    if (closeBtn) await closeBtn.click();
    await new Promise(r => setTimeout(r, 400));
  }

  // 4. Application Tracker Tab
  console.log('Capturing 4: Application Tracker...');
  const navBtns = await page.$$('.nav-btn');
  for (const btn of navBtns) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text.includes('Track Applications')) {
      await btn.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 700));
  await page.screenshot({ path: path.join(screenshotsDir, 'screenshot_4_application_tracker.png'), fullPage: true });

  // 5. Student Profile Tab
  console.log('Capturing 5: Student Profile...');
  const navBtns2 = await page.$$('.nav-btn');
  for (const btn of navBtns2) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text.includes('Student Profile')) {
      await btn.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 700));
  await page.screenshot({ path: path.join(screenshotsDir, 'screenshot_5_student_profile.png'), fullPage: true });

  // 6. Switch to Employer Role
  console.log('Capturing 6: Recruiter Dashboard...');
  const roleTabs = await page.$$('.role-tab');
  for (const tab of roleTabs) {
    const text = await page.evaluate(el => el.textContent, tab);
    if (text.includes('Employer')) {
      await tab.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 700));
  await page.screenshot({ path: path.join(screenshotsDir, 'screenshot_6_recruiter_dashboard.png'), fullPage: true });

  // 7. Recruiter Candidates Tab
  console.log('Capturing 7: Candidate Reviewer...');
  const candBtns = await page.$$('.btn-secondary');
  for (const btn of candBtns) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text.includes('Candidate Reviewer')) {
      await btn.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 700));
  await page.screenshot({ path: path.join(screenshotsDir, 'screenshot_7_candidate_reviewer.png'), fullPage: true });

  // 8. Post Opportunity Modal
  console.log('Capturing 8: Post Job Modal...');
  const postBtn = await page.$('.navbar .btn-primary');
  if (postBtn) {
    await postBtn.click();
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: path.join(screenshotsDir, 'screenshot_8_post_job_modal.png') });
  }

  await browser.close();
  console.log('All screenshots captured successfully in:', screenshotsDir);
}

capture().catch(err => {
  console.error('Error during capture:', err);
  process.exit(1);
});
