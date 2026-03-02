/**
 * Test setup file for Vitest
 * 
 * This file is run before all tests to set up the testing environment.
 */

// Temporarily comment out to debug CSS issue
// import '@testing-library/jest-dom';

// Mock CSS imports
import { vi } from 'vitest';
vi.mock('*.css', () => ({}));
vi.mock('*.scss', () => ({}));
