# AutoNote Plan Comparison

This document outlines the feature differences between AutoNote's subscription tiers, designed to provide value to individual users while creating a clear path to revenue through our freemium SaaS model.

---

## Overview

AutoNote offers three tiers to serve different user needs:
- **Starter (Free)**: Core functionality with usage limits
- **Pro (Premium)**: Full features for power users and professionals  
- **Teams (Business)**: Collaboration features for organizations

---

## Detailed Feature Comparison

| Feature | Starter (Free) | Pro ($10/month) | Teams ($15/user/month) |
|---------|----------------|-----------------|------------------------|
| **Core Features** | | | |
| Multi-modal input (audio, image, text) | ✅ | ✅ | ✅ |
| Note transformations | **10-15 per month** | **Unlimited** | **Unlimited** |
| All transformation styles | ✅ | ✅ | ✅ |
| Standard semantic search | ✅ | ✅ | ✅ |
| **Advanced AI Features** | | | |
| Conversational Q&A ("Ask Your Notes") | **3-5 queries per day** | **Unlimited** | **Unlimited** |
| AI model quality | Standard | **Higher quality models** | **Higher quality models** |
| **Organization & Storage** | | | |
| Workspaces | **2 maximum** | **Unlimited** | **Unlimited** |
| Total storage | **1 GB** | **Unlimited** | **Unlimited** |
| Max file upload size | **5 MB** | **10 MB** | **15 MB** |
| Max note length | 2,000 characters | 5,000 characters | 5,000 characters |
| **Note Management** | | | |
| Note history access | **Last 7 days only** | **Extended history** | **Extended history** |
| One-click version revert | ❌ | ✅ | ✅ |
| Manual and AI-suggested tagging | ✅ | ✅ | ✅ |
| **Visualization & Discovery** | | | |
| Note graph view | ❌ | ✅ | ✅ |
| Note map view | ❌ | ✅ | ✅ |
| **Collaboration** | | | |
| Personal workspaces | ✅ | ✅ | ✅ |
| Team workspaces | ❌ | ❌ | ✅ |
| Role-based sharing (Editor/Viewer) | ❌ | ❌ | ✅ |
| Centralized team administration | ❌ | ❌ | ✅ |
| **Technical** | | | |
| Cross-device sync | **2 devices** | **Unlimited devices** | **Unlimited devices** |
| Offline access | ✅ | ✅ | ✅ |
| **Support** | | | |
| Community support | ✅ | ✅ | ✅ |
| Email support | ❌ | ✅ | ✅ |
| Priority support | ❌ | ❌ | ✅ |

---

## Usage Limits Summary

### Starter (Free)
- **Goal**: Experience core AutoNote functionality with zero friction
- **Target**: Casual users, students, light note-takers
- **Key Constraints**: 
  - 10-15 note transformations per month
  - 3-5 Q&A queries per day
  - 2 workspaces maximum
  - 1 GB total storage

### Pro (Premium) 
- **Goal**: Full AutoNote experience for power users
- **Target**: Professionals, researchers, heavy note-takers
- **Key Benefits**:
  - Unlimited transformations and Q&A
  - Advanced visualization features
  - Extended note history with revert capability
  - Higher quality AI models

### Teams (Business)
- **Goal**: Collaborative knowledge management for organizations
- **Target**: Companies, teams, collaborative projects  
- **Key Benefits**:
  - All Pro features for every team member
  - Shared team workspaces
  - Role-based permissions and sharing
  - Centralized administration

---

## Conversion Strategy

The freemium model is designed to:

1. **Hook Users**: Free tier provides enough value to experience AutoNote's core magic
2. **Create Friction**: Usage limits naturally surface for engaged users who would benefit from upgrading
3. **Drive Conversions**: Power users who hit limits are ideal conversion candidates
4. **Sustainable Economics**: Free tier limits keep AI API costs manageable while demonstrating value

---

## Technical Implementation Notes

- Usage limits are enforced at the AI Agent level before expensive operations
- Plan checks occur before note transformations, Q&A queries, and feature access
- Upgrade prompts are shown when users reach their limits
- All limits reset on appropriate cycles (daily for Q&A, monthly for transformations) 