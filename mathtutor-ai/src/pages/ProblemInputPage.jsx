import React, { useState, useRef, useEffect } from 'react';
import {
  Type,
  Image as ImageIcon,
  PenTool,
  FileText,
  Mic,
  UploadCloud,
  X,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Eraser,
  Sparkles
} from 'lucide-react';

const INPUT_TABS = [
  { id: 'text', label: 'Gõ văn bản', icon: Type },
  { id: 'image', label: 'Tải ảnh', icon: ImageIcon },
  { id: 'draw', label: 'Vẽ tay', icon: PenTool },
  { id: 'pdf', label: 'Tải PDF', icon: FileText },
  { id: 'voice', label: 'Giọng nói', icon: Mic }
];

export function ProblemInputPage({ onSubmitCustomProblem, onNavigate, showToast }) {
  const [activeTab, setActiveTab] = useState('image');
  const [formulaText, setFormulaText] = useState('2x + 5 = 15');
  const [selectedFile, setSelectedFile] = useState({
    name: 'bai_toan_phuong_trinh.png',
    type: 'image/png',
    sizeKB: 184,
    isDefaultPreview: true,
    dataUrl: null
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  // Canvas drawing state
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokeColor, setStrokeColor] = useState('#1e293b');

  useEffect(() => {
    if (activeTab === 'draw' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = 'bold 26px serif';
      ctx.fillStyle = '#334155';
      ctx.fillText('2x + 5 = 15', 90, 95);
    }
  }, [activeTab]);

  const handleFileChange = (e, allowedMode = 'image') => {
    setErrorMsg('');
    setSuccessMsg('');
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const maxBytes = 10 * 1024 * 1024; // 10MB
    if (file.size > maxBytes) {
      setErrorMsg('Dung lượng tệp vượt quá 10MB. Vui lòng chọn tệp nhỏ hơn 10MB.');
      return;
    }

    if (allowedMode === 'image' && !file.type.startsWith('image/')) {
      setErrorMsg('Định dạng không hợp lệ. Chỉ hỗ trợ tệp ảnh JPG, PNG, HEIC hoặc WEBP.');
      return;
    }

    if (allowedMode === 'pdf' && file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setErrorMsg('Vui lòng chọn tệp định dạng .PDF hợp lệ.');
      return;
    }

    const sizeKB = Math.max(1, Math.round(file.size / 1024));
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedFile({
          name: file.name,
          type: file.type,
          sizeKB,
          isDefaultPreview: false,
          dataUrl: reader.result
        });
        setSuccessMsg(`Đã tải tệp ảnh "${file.name}" (${sizeKB} KB) ở trình duyệt.`);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile({
        name: file.name,
        type: 'application/pdf',
        sizeKB,
        isDefaultPreview: false,
        dataUrl: null
      });
      setSuccessMsg(`Đã chọn tệp PDF "${file.name}" (${sizeKB} KB). Lưu ý: Chế độ trích xuất OCR PDF đang ở mức mô phỏng giao diện.`);
    }
  };

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const drawMove = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = strokeColor;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const handleUseProblem = () => {
    setErrorMsg('');
    const trimmed = formulaText.trim();
    if (!trimmed) {
      setErrorMsg('Vui lòng nhập hoặc xác nhận nội dung biểu thức bài toán trước khi gửi sang AI Tutor.');
      return;
    }
    onSubmitCustomProblem(trimmed);
    showToast(`Đã chuyển bài toán "${trimmed}" sang AI Tutor!`, 'success');
    onNavigate('tutor');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-2xl p-6 shadow-xs space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Nhập bài toán</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Chọn phương thức nhập đề bài để bắt đầu phiên hướng dẫn Socratic cùng AI Tutor
            </p>
          </div>
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            Xử lý cục bộ tại trình duyệt (Demo OCR)
          </span>
        </div>

        {/* 5 Method Tabs matching Screen 3 */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {INPUT_TABS.map((tab) => {
            const IconComponent = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  setErrorMsg('');
                }}
                className={`flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-xl border text-xs font-semibold transition-all ${
                  active
                    ? 'bg-blue-50/90 dark:bg-blue-950 border-blue-500 text-blue-600 dark:text-blue-400 shadow-2xs'
                    : 'bg-slate-50/70 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Error / Success Banner */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 flex items-center gap-2.5 text-xs font-medium text-rose-700 dark:text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2.5 text-xs font-medium text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Tab 1: Tải ảnh (Matches Screen 3 Reference Directly) */}
        {activeTab === 'image' && (
          <div className="space-y-5">
            <div className="border-2 border-dashed border-blue-200 dark:border-slate-600 bg-slate-50/60 dark:bg-slate-900/40 rounded-2xl p-7 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-white">Kéo thả ảnh vào đây</p>
                <p className="text-xs text-slate-400 mt-0.5">hoặc</p>
              </div>
              <div>
                <label className="inline-block cursor-pointer px-4 py-2 rounded-xl bg-blue-100/80 dark:bg-blue-950 hover:bg-blue-200/80 text-blue-700 dark:text-blue-300 text-xs font-semibold transition-colors">
                  <span>Chọn ảnh từ thiết bị</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'image')}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-[11px] text-slate-400">
                Hỗ trợ: JPG, PNG, HEIC (tối đa 10MB)
              </p>
            </div>

            {/* Preview + Tips Row matching Screen 3 */}
            {selectedFile && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center bg-slate-50/80 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700">
                <div className="md:col-span-7 relative">
                  <button
                    type="button"
                    onClick={() => setSelectedFile(null)}
                    className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center shadow-md hover:bg-rose-600 transition-colors"
                    title="Xóa ảnh đã chọn"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {selectedFile.dataUrl ? (
                    <img
                      src={selectedFile.dataUrl}
                      alt={selectedFile.name}
                      className="w-full h-32 object-contain rounded-xl bg-white border border-slate-200 p-2"
                    />
                  ) : (
                    <div className="w-full h-32 rounded-xl bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex flex-col items-center justify-center border border-slate-300 dark:border-slate-600 shadow-inner">
                      <span className="text-2xl sm:text-3xl font-serif font-bold tracking-wider text-slate-800 dark:text-white">
                        {formulaText || '2x + 5 = 15'}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-300 mt-1">
                        {selectedFile.name} • {selectedFile.sizeKB} KB
                      </span>
                    </div>
                  )}
                </div>

                <div className="md:col-span-5 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <div className="font-bold text-slate-800 dark:text-white">Gợi ý:</div>
                  <ul className="space-y-1.5 list-disc list-inside text-slate-500 dark:text-slate-400">
                    <li>Chụp rõ nét bài toán</li>
                    <li>Đảm bảo đủ ánh sáng</li>
                    <li>Có thể chụp nhiều trang</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Gõ văn bản */}
        {activeTab === 'text' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                Nhập đề bài hoặc biểu thức toán học:
              </label>
              <textarea
                rows={4}
                value={formulaText}
                onChange={(e) => setFormulaText(e.target.value)}
                placeholder="Ví dụ: Giải phương trình 2x + 5 = 15"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-3.5 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {['2x + 5 = 15', '3x - 5 < 10', 'x² - 5x + 6 = 0', '{ x + y = 7 ; x - y = 1 }'].map((sample) => (
                <button
                  key={sample}
                  type="button"
                  onClick={() => setFormulaText(sample)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-blue-50 hover:text-blue-600 font-mono"
                >
                  {sample}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Vẽ tay Canvas */}
        {activeTab === 'draw' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Viết công thức toán học lên bảng trắng bên dưới:
              </span>
              <div className="flex items-center gap-2">
                {['#1e293b', '#2563eb', '#e11d48'].map((col) => (
                  <button
                    key={col}
                    type="button"
                    onClick={() => setStrokeColor(col)}
                    className={`w-5 h-5 rounded-full border-2 ${
                      strokeColor === col ? 'border-blue-500 scale-110' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: col }}
                    aria-label="Chọn màu bút"
                  />
                ))}
                <button
                  type="button"
                  onClick={clearCanvas}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200"
                >
                  <Eraser className="w-3.5 h-3.5" />
                  <span>Xóa bảng</span>
                </button>
              </div>
            </div>
            <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden bg-white">
              <canvas
                ref={canvasRef}
                width={520}
                height={180}
                onMouseDown={startDrawing}
                onMouseMove={drawMove}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={drawMove}
                onTouchEnd={stopDrawing}
                className="w-full h-44 cursor-crosshair touch-none"
              />
            </div>
          </div>
        )}

        {/* Tab 4: Tải PDF */}
        {activeTab === 'pdf' && (
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl p-6 text-center space-y-3">
            <FileText className="w-8 h-8 text-blue-600 mx-auto" />
            <p className="text-sm font-bold text-slate-800 dark:text-white">
              Chọn tệp PDF phiếu bài tập hoặc đề cương
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Hệ thống kiểm tra định dạng PDF tại trình duyệt (tối đa 10MB). Tính năng bóc tách công thức tự động đang ở chế độ Demo.
            </p>
            <label className="inline-block cursor-pointer px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold">
              <span>Chọn tệp PDF từ máy</span>
              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={(e) => handleFileChange(e, 'pdf')}
                className="hidden"
              />
            </label>
          </div>
        )}

        {/* Tab 5: Giọng nói (Demo) */}
        {activeTab === 'voice' && (
          <div className="rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 p-6 text-center space-y-4">
            <button
              type="button"
              onClick={() => {
                setIsRecording(!isRecording);
                if (!isRecording) {
                  setTimeout(() => {
                    setIsRecording(false);
                    setFormulaText('2x + 5 = 15');
                    setSuccessMsg('Đã nhận diện câu lệnh mẫu (Demo): "Giải phương trình hai x cộng năm bằng mười lăm".');
                  }, 1200);
                }
              }}
              className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center text-white shadow-md transition-all ${
                isRecording ? 'bg-rose-500 animate-pulse scale-105' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              <Mic className="w-7 h-7" />
            </button>
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-white">
                {isRecording ? 'Đang lắng nghe giọng nói (Demo)...' : 'Nhấn vào micro để đọc đề toán (Chế độ Demo)'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Ví dụ: “Giải phương trình hai x cộng năm bằng mười lăm”
              </p>
            </div>
          </div>
        )}

        {/* Editable Recognized Problem Expression Box & Primary Action Button */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-700 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
              Nội dung bài toán sẽ chuyển sang AI Tutor (bạn có thể chỉnh sửa lại nếu cần):
            </label>
            <input
              type="text"
              value={formulaText}
              onChange={(e) => setFormulaText(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-800 dark:text-white math-expr focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleUseProblem}
              className="flex-1 sm:flex-initial min-w-[220px] py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-sm transition-colors inline-flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{activeTab === 'image' ? 'Dùng ảnh này' : 'Bắt đầu giải cùng AI Tutor'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <span className="text-[11px] text-slate-400">
              Không tải dữ liệu lên máy chủ • Bảo mật tuyệt đối
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
