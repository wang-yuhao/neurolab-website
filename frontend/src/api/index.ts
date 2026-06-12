import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

export const getMetrics = () => api.get('/metrics').then(r => r.data)
export const getPublications = () => api.get('/publications').then(r => r.data)
export const getPublication = (id: string) => api.get(`/publications/${id}`).then(r => r.data)
export const getTeam = () => api.get('/team').then(r => r.data)
export const submitContact = (data: {
  name: string
  email: string
  subject: string
  message: string
}) => api.post('/contact', data).then(r => r.data)

export default api
