# Back-End Development

Each team must have completed and [demo'd](https://knowledge.kitchen/content/courses/agile-development-and-devops/scrum/stakeholder-demos/) the working back-end of their group project by the end of the corresponding Sprint.

## Technical requirements

### Musts...

- All back-end code **must** be generated using **Express.js**.
- All dynamic routes **must** be completed and must respond with mock `JSON` data that is either hard-coded into the server code for now or [proxied](https://knowledge.kitchen/content/courses/agile-development-and-devops/slides/express/#107) by the back-end from a mocking API, e.g. [mockaroo](https://mockaroo.com/).
- All static routes **must** be completed and respond with the requested file.
- The front- and back-end **must** be completely integrated by the end of this sprint. The front-end **must** be updated to make requests to the back-end for all data and functionality. Any forms on the front-end must `POST` data to an appropriate server route, although that route need not save the data anywhere for now.
- Each developer **must** have written **unit tests** using the **mocha** and **chai** modules that provide at least `10%` code coverage of the back-end code. Use the [c8](https://www.npmjs.com/package/c8) module to verify code coverage.
- Instructions on how to set up and run the project **must** be included in the ` README.md` file in version control. It **must** be possible for anybody to follow the instructions on the `README.md` to build and run the project on their local machines.
- Credentials or URIs for logging into databases, APIs, or other remote services, must never be shared in version control. They are usually stored in private settings files, such as `.env` or similar, which are not included in the version control repository.

## Grading

Individuals will be graded, in part, according to...

- individual code contributions, as visible through git logs - make sure you commit your own work!
- proper adherence to the [Feature Branch git workflow](https://knowledge.kitchen/content/courses/agile-development-and-devops/slides/feature-branch-workflow/)
- the [proper setup and maintenance of a GitHub repository](./instructions-0c-project-setup.md)
- the quality of the work as a whole

Any `.env` files necessary for the functioning of the project must be submitted to admins/managers via the team's messenger channel.
