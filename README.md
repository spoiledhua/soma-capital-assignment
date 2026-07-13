## Soma Capital Technical Assessment

This is a technical assessment as part of the interview process for Soma Capital.

> [!IMPORTANT]  
> You will need a Pexels API key to complete the technical assessment portion of the application. You can sign up for a free API key at https://www.pexels.com/api/  

To begin, clone this repository to your local machine.

## Development

This is a [NextJS](https://nextjs.org) app, with a SQLite based backend, intended to be run with the LTS version of Node.

To run the development server:

```bash
npm i
npm run dev
```

## Task:

Modify the code to add support for due dates, image previews, and task dependencies.

### Part 1: Due Dates 

When a new task is created, users should be able to set a due date.

When showing the task list is shown, it must display the due date, and if the date is past the current time, the due date should be in red.

### Part 2: Image Generation 

When a todo is created, search for and display a relevant image to visualize the task to be done. 

To do this, make a request to the [Pexels API](https://www.pexels.com/api/) using the task description as a search query. Display the returned image to the user within the appropriate todo item. While the image is being loaded, indicate a loading state.

You will need to sign up for a free Pexels API key to make the fetch request. 

### Part 3: Task Dependencies

Implement a task dependency system that allows tasks to depend on other tasks. The system must:

1. Allow tasks to have multiple dependencies
2. Prevent circular dependencies
3. Show the critical path
4. Calculate the earliest possible start date for each task based on its dependencies
5. Visualize the dependency graph

## Submission:

1. Add a new "Solution" section to this README with a description and screenshot or recording of your solution. 
2. Push your changes to a public GitHub repository.
3. Submit a link to your repository in the application form.

Thanks for your time and effort. We'll be in touch soon!

## Solution

I implemented the three requirements for this assessment: due dates, image generation, and task dependencies. The due dates and image generation were smaller changes and self-explanatory.

For task dependencies:
- A `TodoDependency` model acts as edges in the dependency DAG and references dependent and prerequisite `Todo` instances. The existing `Todo` model is similarly extended to reference the dependent and prerequisite `TodoDependency` instances.
- I added new endpoints to add and delete dependencies with comprehensive error handling.
- Two utility functions are introduced to handle detecting a cycle in the graph and computing the critical path.
- Some new components are added for the frontend, in particular for a pop-up that allows the user to select / deselect dependencies for a task (and disallows adding dependencies that create a cycle), and a graph visualizer using ReactFlow.

Some caveats:
- The critical path in a project management context often assigns a duration to each task in the workflow (which is used to measure how long each workflow would take and which one takes the longest). For this project, since the todo's didn't come with a duration, I compute the critical path assuming each task would take the same amount of time. Thus, the critical path is just the longest path in the DAG. If there's a tie, multiple paths are marked as critical paths.
- A task's earliest start time is computed as the latest due date of all its prerequisites. If a task doesn't have any prerequisites, its earliest start time is considered today. This is an oversimplification to keep things simple (a task can be finished before its due date) and optimize for the worst-case scenario.

https://github.com/user-attachments/assets/32d777d1-546c-4c69-b982-666b8b95abe3
