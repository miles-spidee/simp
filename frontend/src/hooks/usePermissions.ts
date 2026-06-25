"use client";

import { useContext } from 'react';
import { PermissionContext } from '../context/PermissionContext';

export function usePermissions() {
  const ctx = useContext(PermissionContext);
  return ctx;
}
