# Contrubuting & Team Collaboration Guidelines 

## Team Values 

### How the team will work together?
- The team will work collaboratively using shared tools such as GitHub, project boards, and Discord for group messaging.
- Tasks will be discussed and assigned during regular check-ins or sprint planning meetings.
- Each team member is responsible for understanding their assigned tasks and communicating progress or blockers early.

### How each team member will ask for help?
- Team members are encouraged to ask for help as soon as they encounter blockers.
- Help can be requested by:
    - Team Chat (for quick questions)
    - Scheduled meetings (for deeper issues)

### Conflict Resolution
- Conflicts should be addressed respectfully and directly between involved parties first.
- If a conflict cannot be resolved privately, it should be brought to the full team for discussion.
- The goal is to respect each others opinions and come to an understanding on resolving the conflict.

### Consensus on Project Direction
- Major decisions will be discussed as a team during meetings.
- All members are encouraged to voice their opinions and concerns.
- Consensus will be reached through discussion; if consensus cannot be reached, the Product Owner  will make the final decision in the best interest of the project and timeline.

### Handling Missed Responsibilities
- If a team member is struggling to meet their obligations, they are expected to communicate this early.
- The team will first attempt to redistribute work or offer support.
- If missed obligations persist:
    - The issue will be documented
    - A private discussion will be held to understand the cause
    - Next steps will be agreed upon collectively
- Continued failure to deliver may be escalated according to course or project guidelines.
 
### Communication and Response Expectations
- Team members are expected to respond to direct messages within 24 hours on weekdays.
- During critical periods (ex.deadlines, releases), faster responses may be expected.
- If a member will be unavailable, they should notify the team in advance.

## Git Workflow

### Cloning the Repository
Each team member must clone the repository to their local machine before starting development.
```
git clone https://github.com/<organization-name>/<repository-name>.git
cd <repository-name>
```

### Branches
Each team member must create their own branch for any work.
```
git checkout -b feature/short-description
```

### Updating Repository
After making the desired changes:
```
git add .
git commit -m "Clear and descriptive commit message"
```
Commit messages must be concise but clearly describe what was changed.

### Pushing Your Branch
Push your branch to GitHub:
```
git push origin feature/short-description
```

### Creating a Pull Request
1. Go to the repository on GitHub
2. Click Compare & pull request
3. Ensure base branch = `main` and compare branch = your branch
4. Provide a clear description
5. Link any related issues
6. Submit the pull request
7. Delete the branch you created if your work for that feature is completed

### Pull Request Review Policy
- At least one other team member must review and approve the PR.
- All CI checks must pass before merging.
- Address any requested changes before merging.

### Keep Your Main Branch Updated
Before starting new work:
```
git checkout main
git pull origin main
```
Then create a new branch from the updated main.

### Important Rules
- Do not merge directly to `main`
- Do not merge without review
- Keep PRs small and focused
- Delete branches after merging

## Sprint Cadence

### Sprint Length
The StudySync team will operate on a **two-week sprint cycle**. This sprint length balances productivity and well-being by providing enough time to complete meaningful work without creating unnecessary pressure. 

## Standups & Team Sync

### Standup Schedule
- Standups will be held **three times per week**.
- Each standup will last **10–15 minutes**.
- Standups are held at a consistent, agreed-upon time.

### Attendance Expectations
- All team members are expected to attend standups **synchronously**.
- Standups are mandatory unless prior notice is given.
- Team members will **not speak on behalf of or cover for other members** who are absent or unprepared.

## Progress Tracking & Accountability
During each standup, team members will briefly report:
- What they worked on since the last standup
- What they plan to work on next
- Any blockers or challenges they are facing

### Lack of Progress Policy
- If a team member reports **no progress on the same task for two or more consecutive standups**, the situation will be documented.
- The issue will then be escalated to project management or the designated team lead for follow-up.
- This policy exists to surface blockers early and support accountability, not to assign blame.

## Coding Standards 
- **Code Editor**: VS Code
- **Code Linter**: TBD 

## Setting up Local Development Environment
*Information will be added once basic setup is complete.*

## Building and Testing
*Information will be added once basic setup is complete.*