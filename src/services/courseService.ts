import { createCrudService } from './factory'
import api from './api'
import type { Course, CourseCreate, CourseUpdate } from '../types'

export const courseService = createCrudService<Course, CourseCreate, CourseUpdate>({ basePath: '/courses' })

export async function uploadCourseImage(courseId: number, file: File): Promise<Course> {
  const form = new FormData()
  form.append('file', file)
  const { data } = await api.post<Course>(`/courses/${courseId}/image`, form)
  return data
}

export async function deleteCourseImage(courseId: number): Promise<Course> {
  const { data } = await api.delete<Course>(`/courses/${courseId}/image`)
  return data
}
