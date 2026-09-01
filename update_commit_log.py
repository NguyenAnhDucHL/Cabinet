import sys
from datetime import datetime

with open("COMMIT_LOG.md", "r", encoding="utf-8") as f:
    content = f.read()

entry = f"""### [{datetime.now().strftime('%Y-%m-%d %H:%M')}] Hoàn thành tính năng gửi lịch họp, báo vắng và phiếu lấy ý kiến
- **Mô tả**: Đã hoàn thiện toàn bộ luồng nghiệp vụ Phase 1 và 2 từ tài liệu HDSD:
  1. Gửi lịch họp / Thông báo mời họp (MeetingDetail)
  2. Báo vắng + Cử người đi thay (MeetingDetail)
  3. Phê duyệt / Từ chối báo vắng (dành cho Admin/Chủ trì)
  4. Gửi Phiếu lấy ý kiến (QuestionnaireTable)
  5. Trả lời Phiếu lấy ý kiến (Thành viên - QuestionnaireMyList)
  Cập nhật đầy đủ schema DB (`InvitationSentAt`, `AbsenceReason`, `SubstituteUserId`, `AbsenceStatus`, `SentAt`, `QuestionnaireItems`, `QuestionnaireResponses`). Đã áp dụng `ConfirmationModal` cho hành động xóa.
- **Tệp thay đổi**:
  - `Cabinet.Core/Models/Meeting.cs` (Sửa đổi)
  - `Cabinet.Core/Models/Questionnaire.cs` (Sửa đổi)
  - `Cabinet.Core/Data/Repositories/MeetingRepository.cs` (Sửa đổi)
  - `Cabinet.Core/Data/Repositories/QuestionnaireRepository.cs` (Sửa đổi)
  - `Cabinet.Api/Controllers/Cabinet/MeetingsController.cs` (Sửa đổi)
  - `Cabinet.Api/Controllers/Cabinet/QuestionnairesController.cs` (Sửa đổi)
  - `Cabinet.Api/ClientApp/src/features/meetings/api/meetingApi.js` (Sửa đổi)
  - `Cabinet.Api/ClientApp/src/features/questionnaires/api/questionnaireApi.js` (Sửa đổi)
  - `Cabinet.Api/ClientApp/src/cabinet/pages/MeetingDetail.jsx` (Sửa đổi)
  - `Cabinet.Api/ClientApp/src/features/questionnaires/components/QuestionnaireList/QuestionnaireSidebar.jsx` (Sửa đổi)
  - `Cabinet.Api/ClientApp/src/features/questionnaires/components/QuestionnaireList/QuestionnaireTable.jsx` (Sửa đổi)
  - `Cabinet.Api/ClientApp/src/features/questionnaires/components/QuestionnaireList/QuestionnaireMyList.jsx` (Mới)
- **Lệnh git commit**: `git commit -m "feat(cabinet): hoàn thiện luồng gửi lịch họp, báo vắng và trả lời phiếu lấy ý kiến"`

"""

# Prepend the entry
content = content.replace("### [2026-09-01 10:15] Synchronize all deletions to use ConfirmationModal", entry + "### [2026-09-01 10:15] Synchronize all deletions to use ConfirmationModal")

with open("COMMIT_LOG.md", "w", encoding="utf-8") as f:
    f.write(content)
