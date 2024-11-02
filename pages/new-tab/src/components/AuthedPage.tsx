import React, { useState } from 'react';
import { Upload, Loader2, ArrowRight } from 'lucide-react';

const AuthedPage = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // @ts-ignore
  const handleFileUpload = event => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          return 0;
        }
        return prev + 10;
      });
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Logos */}
        <div className="flex justify-between mb-8">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <span className="text-blue-600 font-bold">L1</span>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <span className="text-blue-600 font-bold">L2</span>
          </div>
        </div>

        {/* Main Content - Upload and Process Row */}
        <div className="flex items-center gap-6">
          {/* Upload Section */}
          <div className="flex-1 bg-white rounded-xl shadow-sm p-6">
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
              <input type="file" id="file-upload" className="hidden" onChange={handleFileUpload} />
              <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                <Upload className="w-10 h-10 text-gray-400 mb-3" />
                <span className="text-sm text-gray-600">Click to upload or drag and drop</span>
              </label>
            </div>
          </div>

          {/* Arrow Indicator */}
          <div className="flex items-center justify-center">
            <ArrowRight className="w-8 h-8 text-gray-400" />
          </div>

          {/* Process Section */}
          <div className="flex-1 bg-white rounded-xl shadow-sm p-6">
            {uploading ? (
              <div className="flex items-center space-x-4 p-4">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                <div className="flex-1">
                  <div className="h-2 bg-blue-100 rounded-full">
                    <div
                      className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}></div>
                  </div>
                  <span className="text-sm text-blue-600 mt-2 block">Processing... {uploadProgress}%</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <span className="text-gray-400 text-sm">Waiting for file upload...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthedPage;
