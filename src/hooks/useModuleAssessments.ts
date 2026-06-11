import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { moduleAssessmentService } from '../services/moduleAssessmentService'
import type { ModuleAssessment, AttemptResult, CourseProgressSummary, AllProgressSummary } from '../types'

export function useModuleAssessment(moduleId: number) {
  return useQuery<ModuleAssessment>({
    queryKey: ['module-assessment', moduleId],
    queryFn: () => moduleAssessmentService.getByModule(moduleId),
    enabled: moduleId > 0,
  })
}

export function useUpsertAssessment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ moduleId, data }: { moduleId: number; data: { passing_score: number; questions: unknown[] } }) =>
      moduleAssessmentService.upsert(moduleId, data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['module-assessment', variables.moduleId] })
    },
  })
}

export function useDeleteAssessment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (assessmentId: number) => moduleAssessmentService.delete(assessmentId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['module-assessment'] })
    },
  })
}

export function useSubmitAssessment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ assessmentId, answers }: { assessmentId: number; answers: { question_id: number; selected_option_id: number }[] }) =>
      moduleAssessmentService.submit(assessmentId, { answers }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['course-progress-summary'] })
      qc.invalidateQueries({ queryKey: ['all-progress-summaries'] })
    },
  })
}

export function useAssessmentAttempts(assessmentId: number) {
  return useQuery<AttemptResult[]>({
    queryKey: ['assessment-attempts', assessmentId],
    queryFn: () => moduleAssessmentService.getAttempts(assessmentId),
    enabled: assessmentId > 0,
  })
}

export function useCourseProgressSummary(courseId: number, userId?: number) {
  return useQuery<CourseProgressSummary>({
    queryKey: ['course-progress-summary', courseId, userId],
    queryFn: () => moduleAssessmentService.getCourseSummary(courseId, userId),
    enabled: courseId > 0,
  })
}

export function useAllProgressSummaries(userId?: number) {
  return useQuery<AllProgressSummary>({
    queryKey: ['all-progress-summaries', userId],
    queryFn: () => moduleAssessmentService.getAllSummaries(userId),
  })
}
