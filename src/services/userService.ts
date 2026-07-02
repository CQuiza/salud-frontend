import api from './api'
import type { User, UserCreate, UserListResponse, UserUpdate, UserWithCertificatesListResponse } from '../types'

export const userService = {
  list: async (params?: Record<string, unknown>): Promise<UserListResponse> => {
    const { data } = await api.get<UserListResponse>('/users', { params })
    return data
  },

  getById: async (id: number): Promise<User> => {
    const { data } = await api.get<User>(`/users/${id}`)
    return data
  },

  getCertified: async (params?: Record<string, unknown>): Promise<UserWithCertificatesListResponse> => {
    const { data } = await api.get<UserWithCertificatesListResponse>('/users/certified', { params })
    return data
  },

  create: async (payload: UserCreate): Promise<User> => {
    const { data } = await api.post<User>('/users', payload)
    return data
  },

  update: async (id: number, payload: UserUpdate): Promise<User> => {
    const { data } = await api.patch<User>(`/users/${id}`, payload)
    return data
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/users/${id}`)
  },
}
