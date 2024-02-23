'use server';
import 'server-only';

import { cookies } from 'next/headers';
import { Project } from '../projects';
import { revalidatePath } from 'next/cache';

const PROJECT_TYPE_COOKIE = 'firmhouse:project';

export async function saveProjectTypeCookie(
  projectType: Project,
  path: string
) {
  cookies().set(PROJECT_TYPE_COOKIE, projectType.toString());
  revalidatePath(path);
}

export async function getActiveProjectType(): Promise<Project> {
  const activeProjectValue = cookies().get(PROJECT_TYPE_COOKIE)?.value;
  switch (activeProjectValue) {
    case Project.OrderBased:
      return Project.OrderBased;
    case Project.PlanBased:
    default:
      return Project.PlanBased;
  }
}

export async function getAccessTokenForProject(): Promise<string> {
  const project = await getActiveProjectType();
  const {
    NEXT_ORDER_BASED_FIRMHOUSE_WRITE_ACCESS_TOKEN,
    NEXT_PLAN_BASED_FIRMHOUSE_WRITE_ACCESS_TOKEN,
  } = process.env;
  if (
    !NEXT_ORDER_BASED_FIRMHOUSE_WRITE_ACCESS_TOKEN ||
    !NEXT_PLAN_BASED_FIRMHOUSE_WRITE_ACCESS_TOKEN
  ) {
    throw new Error(
      'NEXT_ORDER_BASED_FIRMHOUSE_WRITE_ACCESS_TOKEN and NEXT_PLAN_BASED_FIRMHOUSE_WRITE_ACCESS_TOKEN env variables should be defined.'
    );
  }
  switch (project) {
    case Project.OrderBased:
      return NEXT_ORDER_BASED_FIRMHOUSE_WRITE_ACCESS_TOKEN;
    case Project.PlanBased:
    default:
      return NEXT_PLAN_BASED_FIRMHOUSE_WRITE_ACCESS_TOKEN;
  }
}
