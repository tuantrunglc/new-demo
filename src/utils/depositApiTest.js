// Test file for deposit API integration
// This file can be used to test the deposit API endpoints

import { depositService } from '@/services/depositService';

export const testDepositAPIs = {
  // Test create deposit
  async testCreateDeposit() {
    console.log('Testing create deposit...');
    
    const testData = {
      amount: 500000,
      bank_account: '1234567890',
      description: 'Test deposit',
      proof_image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k='
    };
    
    try {
      const result = await depositService.createDeposit(testData);
      console.log('Create deposit result:', result);
      return result;
    } catch (error) {
      console.error('Create deposit error:', error);
      throw error;
    }
  },

  // Test get user deposits
  async testGetUserDeposits() {
    console.log('Testing get user deposits...');
    
    try {
      const result = await depositService.getUserDeposits({ page: 1, limit: 10 });
      console.log('Get user deposits result:', result);
      return result;
    } catch (error) {
      console.error('Get user deposits error:', error);
      throw error;
    }
  },

  // Test get all deposits (admin)
  async testGetAllDeposits() {
    console.log('Testing get all deposits (admin)...');
    
    try {
      const result = await depositService.getAllDeposits({ 
        page: 1, 
        limit: 10, 
        status: 'pending' 
      });
      console.log('Get all deposits result:', result);
      return result;
    } catch (error) {
      console.error('Get all deposits error:', error);
      throw error;
    }
  },

  // Test update deposit status (admin)
  async testUpdateDepositStatus(depositId) {
    console.log('Testing update deposit status...');
    
    const updateData = {
      status: 'approved',
      admin_note: 'Test approval'
    };
    
    try {
      const result = await depositService.updateDepositStatus(depositId, updateData);
      console.log('Update deposit status result:', result);
      return result;
    } catch (error) {
      console.error('Update deposit status error:', error);
      throw error;
    }
  },

  // Test all APIs in sequence
  async runAllTests() {
    console.log('Running all deposit API tests...');
    
    try {
      // Test user APIs
      console.log('\n=== USER API TESTS ===');
      await this.testGetUserDeposits();
      const createResult = await this.testCreateDeposit();
      
      // Test admin APIs
      console.log('\n=== ADMIN API TESTS ===');
      await this.testGetAllDeposits();
      
      if (createResult?.data?.reference_code) {
        await this.testUpdateDepositStatus(createResult.data.reference_code);
      }
      
      console.log('\n=== ALL TESTS COMPLETED ===');
    } catch (error) {
      console.error('Test suite failed:', error);
    }
  }
};

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.testDepositAPIs = testDepositAPIs;
}

export default testDepositAPIs;