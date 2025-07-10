// Bootstrap utilities for modals and other components
/* eslint-disable no-undef */

/**
 * Initialize a Bootstrap modal
 * @param {string} modalId - The ID of the modal element
 * @returns {Object} - The Bootstrap modal instance
 */
export const initModal = (modalId) => {
  const modalElement = document.getElementById(modalId)
  if (modalElement && window.bootstrap) {
    return new window.bootstrap.Modal(modalElement)
  }
  return null
}

/**
 * Show a Bootstrap modal
 * @param {string} modalId - The ID of the modal element
 */
export const showModal = (modalId) => {
  // Ensure bootstrap is loaded
  if (!window.bootstrap) {
    console.error('Bootstrap is not loaded')
    return
  }
  
  const modalElement = document.getElementById(modalId)
  if (modalElement) {
    const modal = window.bootstrap.Modal.getInstance(modalElement) || new window.bootstrap.Modal(modalElement)
    modal.show()
  }
}

/**
 * Hide a Bootstrap modal
 * @param {string} modalId - The ID of the modal element
 */
export const hideModal = (modalId) => {
  // Ensure bootstrap is loaded
  if (!window.bootstrap) {
    console.error('Bootstrap is not loaded')
    return
  }
  
  const modalElement = document.getElementById(modalId)
  if (modalElement) {
    const modal = window.bootstrap.Modal.getInstance(modalElement)
    if (modal) {
      modal.hide()
    }
  }
}