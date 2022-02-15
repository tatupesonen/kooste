import * as core from '@actions/core'
import * as github from '@actions/github'
import { subDays } from "date-fns";
import format from 'date-fns/format';

async function run(): Promise<void> {
  try {
    const days: string = core.getInput('days');
		const token: string = core.getInput('token')
		const numDays = parseInt(days);

		const octoKit = github.getOctokit(token);
		const context = github.context;

		const now = Date.now();
		const past = subDays(now, numDays);
		
		const commits = await octoKit.rest.repos.listCommits({
			...context.repo,
		})

		// Filter to commits in past numDays days
		const rows = commits.data.filter(e => new Date(e.commit!.author!.date!) > past);
		const issue = await octoKit.rest.issues.create({
			...context.repo,
			title: format(now, "dd-MM-YYYY"),
			body: `Testing issue body. Commits: ${JSON.stringify(rows)}`
		})	

  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
