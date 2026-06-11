import api from './api'
import type { ModuleAssessment, AttemptResult, CourseProgressSummary, AllProgressSummary } from '../types'

export const moduleAssessmentService = {
  getByModule: async (moduleId: number): Promise<ModuleAssessment> => {
    const { data } = await api.get<ModuleAssessment>(`/modules/${moduleId}/assessment`)
    return data
  },
  upsert: async (moduleId: number, data: { passing_score: number; questions: unknown[] }): Promise<ModuleAssessment> => {
    const { data: res } = await api.post<ModuleAssessment>(`/modules/${moduleId}/assessment`, data)
    return res
  },
  delete: async (assessmentId: number): Promise<void> => {
    await api.delete(`/assessments/${assessmentId}`)
  },
  submit: async (assessmentId: number, data: { answers: { question_id: number; selected_option_id: number }[] }): Promise<AttemptResult> => {
    const { data: res } = await api.post<AttemptResult>(`/assessments/${assessmentId}/submit`, data)
    return res
  },
  getAttempts: async (assessmentId: number): Promise<AttemptResult[]> => {
    const { data } = await api.get<AttemptResult[]>(`/assessments/${assessmentId}/attempts`)
    return data
  },
  getCourseSummary: async (courseId: number, userId?: number): Promise<CourseProgressSummary> => {
    const params = userId ? { user_id: userId } : undefined
    const { data } = await api.get<CourseProgressSummary>(`/user-progress/summary/${courseId}`, { params })
    return data
  },
  getAllSummaries: async (userId?: number): Promise<AllProgressSummary> => {
    const params = userId ? { user_id: userId } : undefined
    const { data } = await api.get<AllProgressSummary>('/user-progress/summary', { params })
    return data
  },
}
