import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createCrudHooks } from './factory'
import { courseService, uploadCourseImage, deleteCourseImage } from '../services/courseService'
import type { Course, CourseCreate, CourseUpdate } from '../types'

export const {
  useList: useCourses,
  useById: useCourse,
  useCreate: useCreateCourse,
  useUpdate: useUpdateCourse,
  useRemove: useDeleteCourse,
} = createCrudHooks<Course, CourseCreate, CourseUpdate>({ queryKey: 'courses', service: courseService })

export function useUploadCourseImage() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ courseId, file }: { courseId: number; file: File }) => uploadCourseImage(courseId, file),
    onSuccess: (updated) => {
      qc.setQueryData(['courses', updated.id], updated)
      qc.invalidateQueries({ queryKey: ['courses'] })
    },
  })
}

export function useDeleteCourseImage() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (courseId: number) => deleteCourseImage(courseId),
    onSuccess: (updated) => {
      qc.setQueryData(['courses', updated.id], updated)
      qc.invalidateQueries({ queryKey: ['courses'] })
    },
  })
}
