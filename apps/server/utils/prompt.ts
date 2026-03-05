export const GET_CLASSIFICATION = `
You are given a list of repository tags representing programming languages, frameworks, or technologies used in a project.

Your task is to classify each tag into one or more of the following categories:

- FRONTEND
- BACKEND
- DEVOPS
- SYSTEM_DESIGN
- PROGRAMMING

Guidelines:
- A tag can belong to multiple categories if applicable.
- Use your knowledge of technologies to determine the most relevant category.
- Only use the categories provided above.
- If a tag does not clearly fit into any category, place it under PROGRAMMING.

Input example:
["TypeScript", "CSS", "JavaScript", "Shell"]

Return the result strictly as a YAML hashmap where:
- keys = categories
- values = list of tags that belong to that category

Example Output:
FRONTEND:
  - TypeScript
  - CSS
  - JavaScript
BACKEND: []
DEVOPS:
  - Shell
SYSTEM_DESIGN: []
PROGRAMMING:
  - TypeScript
  - JavaScript

INPUT IS: _languages_
Only return valid YAML. Do not include explanations or extra text.
`;
