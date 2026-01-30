                     
const BASE_URL = 'http://localhost:8082/api'

//to handle fetch responses
const handleResponse = async (response) => {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  return response.json()
}

//one function to handle all API calls with proper error checking and JSON parsing.
const apiCall = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  try {
    console.log('Making API call to:', url)
    const response = await fetch(url, config)
    console.log('API response status:', response.status)
    return await handleResponse(response)
  } catch (error) {
    console.error('API call failed:', error)
    throw error
  }
}


export const problemAPI = {

  getAllProblems: () => apiCall('/problems'),
  getProblemById: (id) => apiCall(`/problems/${id}`),
  createProblem: (problemData) => apiCall('/problems', {
    method: 'POST',
    body: JSON.stringify(problemData),
  }),
}


export const submissionAPI = {
  getAllSubmissions: () => apiCall('/submissions'),
  getSubmissionById: (id) => apiCall(`/submissions/${id}`),
  submitCode: (submissionData) => apiCall('/submissions', {
    method: 'POST',
    body: JSON.stringify(submissionData),
  }),
  

  runCode: (submissionData) => apiCall('/submissions/run', {
    method: 'POST',
    body: JSON.stringify(submissionData),
  }),
}

export const healthAPI = {
  checkHealth: () => apiCall('/health'),
}

export default { problemAPI, submissionAPI, healthAPI }

