const axios = require("axios");
const fs = require("fs");

const fetchJobAndUpdateReadme = async () => {
  const options = {
    method: "GET",
    url: "https://jsearch.p.rapidapi.com/search",
    params: {
      query: 'Blockchain developer in india',
      page: '1',
      num_pages: '1',
      employment_types: 'intern'
    },
    headers: {
      "X-RapidAPI-Key": "a1bac331e4msh237f231c7662b85p1647b0jsne020041f2ab8",
      "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);

    const jobs = response.data.data;

    if (!jobs || jobs.length === 0) {
      console.log("No job postings found.");
      return;
    }

    const topJobs = jobs.slice(0, 1);
    let jobDetails = "";

    topJobs.forEach((job, index) => {
      jobDetails += `
## Job ${index + 1}

- **Job Title:** ${job.job_title || "N/A"}
- **Company:** ${job.employer_name || "N/A"}
- **Location:** ${job.job_city || "N/A"}, ${job.job_state || "N/A"}, ${
        job.job_country || "N/A"
      }
- **Job Description:** ${job.job_description || "N/A"}

- **Apply here:** [Apply here](${job.job_apply_link || "N/A"})

---
`;
    });

    // Get current date in IST
    const currentTime = new Date();
    const currentOffset = currentTime.getTimezoneOffset();
    const ISTOffset = 330; // IST offset UTC +5:30
    const istTime = new Date(
      currentTime.getTime() + (ISTOffset + currentOffset) * 60000
    );
    const dateString = istTime.toLocaleDateString("en-IN");

    const newContent = `# Job Posting of the Day\n\n<!-- #job -->\n${jobDetails}\n\nUpdated on: [${dateString}]\n<!-- #jobEnd -->`;

    fs.writeFile("README.md", newContent, (err) => {
      if (err) {
        return console.log(err);
      }
      console.log("The file was saved!");
    });
  } catch (error) {
    console.error(error);
  }
};

const init = async () => {
  await fetchJobAndUpdateReadme();
};

init();
