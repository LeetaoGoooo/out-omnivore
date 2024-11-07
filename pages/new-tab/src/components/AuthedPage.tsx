import React, { ChangeEvent, useEffect, useState } from 'react';
import omnivore from '@src/assets/omnivore.svg';
import pocket from '@src/assets/pocket.svg';

import { Upload, ArrowRight, X, Loader, Check } from 'lucide-react';
import { createOmnivore2PocketMessage, MessageType, OmnivoreItem } from '@extension/shared/lib/message/message';
import { readJsonFile } from '@extension/shared/lib/utils';

interface UploadItemProperty {
  status: string;
  total: number;
  items: string[];
  loop: number;
  itemStatus?: boolean[];
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const AuthedPage = () => {
  const [uploadItem, setUploadItem] = useState<UploadItemProperty | null>(null);

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) {
      return;
    }
    const newFiles = Array.from(e.target.files);
    const total = newFiles.length;
    const allItems = [];
    for (let i = 0; i < total; i++) {
      const items = await readJsonFile<OmnivoreItem[]>(newFiles[i]);
      allItems.push(...items);
    }
    await chrome.runtime.sendMessage(
      createOmnivore2PocketMessage({
        items: allItems,
      }),
    );
  };

  useEffect(() => {
    async function listener(request: { type: MessageType; payload: UploadItemProperty }) {
      console.debug(`request: ${JSON.stringify(request)}`);
      if (request.type == MessageType.ADD_TO_POCKET_PROCESS) {
        const payload = request.payload;
        setUploadItem(payload);
      }
    }
    chrome.runtime.onMessage.addListener(listener);
    return () => chrome.runtime.onMessage.removeListener(listener);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Logos */}
        <div className="flex justify-between mb-8">
          <div className="p-3 rounded-xl">
            <div className="w-48 h-48  rounded-lg flex items-center justify-center">
              <img src={omnivore} alt="omnivore" />
            </div>
          </div>
          <div className="p-3 rounded-xl">
            <div className="w-48 h-48  rounded-lg flex items-center justify-center">
              <img src={pocket} alt="pocket" />
            </div>
          </div>
        </div>

        {/* Main Content - Upload and Process Row */}
        <div className="flex items-start gap-6">
          {/* Upload Section */}
          <div className="flex-1 bg-white rounded-xl shadow-sm p-6">
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
              <input type="file" id="file-upload" className="hidden" onChange={e => handleFileUpload(e)} multiple />
              <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                <Upload className="w-10 h-10 text-gray-400 mb-3" />
                <span className="text-sm text-gray-600 mb-1">Click to upload or drag and drop</span>
                <span className="text-xs text-gray-400">You can select multiple files</span>
              </label>
            </div>
          </div>

          {/* Arrow Indicator */}
          <div className="flex items-center justify-center pt-6">
            <ArrowRight className="w-8 h-8 text-gray-400" />
          </div>

          {/* Process Section */}
          <div className="flex-1 bg-white rounded-xl shadow-sm p-6 max-w-[40%]">
            <div className="space-y-4">
              {uploadItem == null ? (
                <div className="text-center text-gray-400 py-4">Waiting for files...</div>
              ) : (
                <div>
                  <div className="mb-1 text-base font-medium">total Records: {uploadItem.total}</div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{
                        width: `${(((uploadItem.loop * 10) / uploadItem.total) * 100).toFixed(0)}%`,
                      }}></div>
                  </div>
                  <ul className="space-y-4 text-left text-gray-500 dark:text-gray-400 m-2 h-[360px] overflow-hidden overflow-y-auto">
                    {uploadItem.items.map((item, index) => {
                      return (
                        <li className="flex items-center space-x-3 rtl:space-x-reverse" key={index}>
                          {uploadItem.itemStatus ? (
                            uploadItem.itemStatus[index] ? (
                              <Check
                                style={{
                                  color: 'green',
                                }}
                              />
                            ) : (
                              <X
                                style={{
                                  color: `red`,
                                }}
                              />
                            )
                          ) : (
                            <svg className="animate-spin h-5 w-5 mr-3 ..." viewBox="0 0 24 24">
                              <Loader className="bg-blue-400" />
                            </svg>
                          )}
                          <span
                            style={{
                              textOverflow: 'ellipsis',
                              overflow: 'hidden',
                              width: '100%',
                              whiteSpace: 'nowrap',
                            }}>
                            {item}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthedPage;
