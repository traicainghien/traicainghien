import { NextRequest } from 'next/server';
import { GET as tasksGet } from '../route';

export async function GET(request: NextRequest) {
  return tasksGet(request);
}
