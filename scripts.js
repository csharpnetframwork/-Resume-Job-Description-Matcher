document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.section');
    const toUploadBtn = document.getElementById('toUploadBtn');
    const toDescriptionBtn = document.getElementById('toDescriptionBtn');
    const toResultBtn = document.getElementById('toResultBtn');
    const restartBtn = document.getElementById('restartBtn');
    const resumeInput = document.getElementById('resumeInput');
    const uploadResponse = document.getElementById('uploadResponse');
    const jobDescription = document.getElementById('jobDescription');
    const resultOutput = document.getElementById('resultOutput');

    const showSection = (sectionId) => {
        sections.forEach(section => section.classList.remove('active'));
        document.getElementById(sectionId).classList.add('active');
    };

    toUploadBtn.addEventListener('click', () => showSection('uploadSection'));
    toDescriptionBtn.addEventListener('click', () => showSection('descriptionSection'));
    toResultBtn.addEventListener('click', () => {
        if (compareResumeWithJobDescription()) {
            showSection('resultSection');
        }
    });
    restartBtn.addEventListener('click', () => showSection('aboutSection'));

    document.getElementById('uploadResumeBtn').addEventListener('click', () => {
        const file = resumeInput.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('language', 'English');

            fetch('https://api.apyhub.com/sharpapi/api/v1/hr/parse_resume', {
                method: 'POST',
                headers: {
                    'apy-token': 'APY0NvvZbaogMdgw5dFUW7hpeQcf5ablsIDS5bbuCRLsPNoFPjWL81vcfJX2odhFhQg6vz'
                },
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                uploadResponse.textContent = 'Resume uploaded successfully!';
                uploadResponse.classList.add('text-success');
                uploadResponse.classList.remove('text-danger');
                sessionStorage.setItem('resumeData', JSON.stringify(data));
            })
            .catch(error => {
                console.error('Error:', error);
                uploadResponse.textContent = 'Error uploading resume!';
                uploadResponse.classList.add('text-danger');
                uploadResponse.classList.remove('text-success');
            });
        } else {
            uploadResponse.textContent = 'Please select a file first.';
            uploadResponse.classList.add('text-danger');
        }
    });

    const compareResumeWithJobDescription = () => {
        const resumeData = JSON.parse(sessionStorage.getItem('resumeData'));
        if (!resumeData) {
            resultOutput.textContent = 'No resume data found. Please upload your resume first.';
            return false;
        }

        const jobDesc = jobDescription.value.toLowerCase();
        const resumeExp = resumeData.experience ? resumeData.experience.toLowerCase() : '';
        const resumeSkills = resumeData.skills ? resumeData.skills.toLowerCase() : '';

        let expMatch = 0;
        let skillsMatch = 0;

        // Experience Matching
        if (jobDesc.includes(resumeExp)) {
            expMatch = 100;
        }

        // Skills Matching
        const jobSkills = jobDesc.match(/key skills:(.*)/);
        if (jobSkills) {
            const jobSkillsArray = jobSkills[1].toLowerCase().split(',').map(skill => skill.trim());
            const matchedSkills = jobSkillsArray.filter(skill => resumeSkills.includes(skill));
            skillsMatch = (matchedSkills.length / jobSkillsArray.length) * 100;
        }

        resultOutput.textContent = `Experience Match: ${expMatch}% | Skills Match: ${skillsMatch.toFixed(2)}%`;

        return true;
    };
});
