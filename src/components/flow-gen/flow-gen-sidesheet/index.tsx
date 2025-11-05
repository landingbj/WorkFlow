import { FC, useState, useRef, useEffect, useContext, useMemo } from 'react';

import { SideSheet, Button, TextArea, Toast, Tabs, TabPane, Dropdown, Upload, Modal, Pagination, Tooltip } from '@douyinfe/semi-ui';
import { IconSpin, IconSend, IconPlus, IconHistory, IconEdit, IconUpload } from '@douyinfe/semi-icons';

import { useClientContext, usePlaygroundTools } from '@flowgram.ai/free-layout-editor';
import { ToolbarContext } from '../../../context/toolbar-context';

interface FlowGenSideSheetProps {
  visible: boolean;
  onCancel: () => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface Conversation {
  id: string;
  title: string;
  textMessages: ChatMessage[]; // Messages for "生成流程" tab
  codeMessages: ChatMessage[]; // Messages for "抽取流程" tab
  fileList: any[];
  flowDocList: any[];
  workflow_json?: any; // 最新生成的工作流的json
}

export const FlowGenSideSheet: FC<FlowGenSideSheetProps> = ({ visible, onCancel }) => {
  const [input, setInput] = useState<string>('');
  const [codeInput, setCodeInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('text');

  const [conversations, setConversations] = useState<Conversation[]>([{
    id: `conv-${Date.now()}`,
    title: '对话 1',
    textMessages: [],
    codeMessages: [],
    fileList: [],
    flowDocList: [],
    workflow_json: undefined
  }]);
  const [currentConversationIndex, setCurrentConversationIndex] = useState<number>(0);
  const [knowledgeBase, setKnowledgeBase] = useState<string>('');
  const [knowledgeBaseOptions, setKnowledgeBaseOptions] = useState<any[]>([]);
  const [kbModalVisible, setKbModalVisible] = useState<boolean>(false);
  const [kbFileList, setKbFileList] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageSize] = useState<number>(5);
  const [userId, setUserId] = useState<string>('');
  const [region, setRegion] = useState<string>('');

  const clientContext = useClientContext();
  const tools = usePlaygroundTools();
  const { setToolbarVisible, setIsCodeFlowMode } = useContext(ToolbarContext);
  // Separate canvas data for each tab
  const textCanvasData = useRef<any>(null);
  const codeCanvasData = useRef<any>(null);
  const isFirstCodeTab = useRef<boolean>(true);
  const lastActiveTab = useRef<string>('text'); // Track which tab's canvas is currently displayed
  // Use ref to store latest conversation index for file change handler
  const currentConversationIndexRef = useRef<number>(0);

  // Fetch user info from agentId
  const fetchUserInfo = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const agentId = urlParams.get('agentId');
      
      if (!agentId) {
        return;
      }

      const response = await fetch(`/knowledge/getBasicInfo?agentId=${agentId}`);
      
      if (response.ok) {
        const result = await response.json();
        if (result.data && result.data.userId && result.data.region) {
          setUserId(result.data.userId);
          setRegion(result.data.region);
        }
      }
    } catch (error) {
      console.error('获取用户信息失败:', error);
    }
  };
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const currentConversation = conversations[currentConversationIndex];
  // Get chat history based on active tab
  const chatHistory = useMemo(() => {
    if (!currentConversation) return [];
    return activeTab === 'text' ? currentConversation.textMessages : currentConversation.codeMessages;
  }, [currentConversation, activeTab]);
  // Use useMemo to ensure fileList returns a new array reference when conversation changes
  const fileList = useMemo(() => {
    return currentConversation?.fileList ? [...currentConversation.fileList] : [];
  }, [currentConversation?.id, currentConversation?.fileList]);
  // Use useMemo to ensure flowDocList returns a new array reference when conversation changes
  const flowDocList = useMemo(() => {
    return currentConversation?.flowDocList ? [...currentConversation.flowDocList] : [];
  }, [currentConversation?.id, currentConversation?.flowDocList]);

  // Update ref when conversation index changes
  useEffect(() => {
    currentConversationIndexRef.current = currentConversationIndex;
  }, [currentConversationIndex]);

  // 确保事件处理函数正确处理输入
  const handleInputChange = (value: string) => {
    // 直接接收Semi UI TextArea组件传递的value
    setInput(value);
  };

  // Handle file change and filter duplicates
  const handleFileChange = ({ fileList: newFileList }: any) => {
    // Filter out duplicate files based on file path, name, size, and lastModified
    const uniqueFiles: any[] = [];
    const fileKeys = new Set<string>();
    
    newFileList.forEach((file: any) => {
      // Create unique key using file properties
      const fileInstance = file.fileInstance;
      const webkitRelativePath = fileInstance?.webkitRelativePath || '';
      const uniqueKey = `${webkitRelativePath || file.name}_${fileInstance?.size}_${fileInstance?.lastModified}`;
      
      if (!fileKeys.has(uniqueKey)) {
        fileKeys.add(uniqueKey);
        uniqueFiles.push(file);
      } else {
        const displayPath = webkitRelativePath || file.name;
        Toast.warning(`文件 "${displayPath}" 已存在，已自动跳过`);
      }
    });
    
    // Update fileList for current conversation using ref to get latest index
    const currentIdx = currentConversationIndexRef.current;
    setConversations(prev => {
      const next = [...prev];
      const conv = { ...next[currentIdx] };
      conv.fileList = uniqueFiles;
      next[currentIdx] = conv;
      return next;
    });
  };


  // 添加用户消息到当前会话
  const addUserMessage = (content: string, tab: 'text' | 'code' = activeTab as 'text' | 'code') => {
    const newMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: Date.now()
    };
    setConversations(prev => {
      const next = [...prev];
      const conv = { ...next[currentConversationIndex] };
      if (tab === 'text') {
        conv.textMessages = [...conv.textMessages, newMessage];
      } else {
        conv.codeMessages = [...conv.codeMessages, newMessage];
      }
      next[currentConversationIndex] = conv;
      return next;
    });
  };

  // 添加助手消息到当前会话
  const addAssistantMessage = (content: string, tab: 'text' | 'code' = activeTab as 'text' | 'code') => {
    const newMessage: ChatMessage = {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      content: content.trim(),
      timestamp: Date.now()
    };
    setConversations(prev => {
      const next = [...prev];
      const conv = { ...next[currentConversationIndex] };
      if (tab === 'text') {
        conv.textMessages = [...conv.textMessages, newMessage];
      } else {
        conv.codeMessages = [...conv.codeMessages, newMessage];
      }
      next[currentConversationIndex] = conv;
      return next;
    });
  };

  // 滚动到聊天底部
  const scrollToBottom = () => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  };

  // 当对话历史更新时自动滚动到底部
  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  

  // 新建对话
  const handleNewConversation = () => {
    // 检查当前对话是否为空
    const currentConv = conversations[currentConversationIndex];
    if (currentConv && currentConv.textMessages.length === 0 && currentConv.codeMessages.length === 0) {
      Toast.info('已是最新对话');
      return;
    }
    
    // 计算新对话的索引
    const newIndex = conversations.length;
    
    setConversations(prev => {
      const idx = prev.length + 1;
      return [...prev, { id: `conv-${Date.now()}`, title: `对话 ${idx}`, textMessages: [], codeMessages: [], fileList: [], flowDocList: [], workflow_json: undefined }];
    });
    setCurrentConversationIndex(newIndex);
    setInput('');
  };


  // Open knowledge base management modal
  const handleEditKnowledgeBase = async () => {
    if (!knowledgeBase) {
      return;
    }
    
    setCurrentPage(1); // Reset to first page when opening modal
    setKbModalVisible(true);
    fetchKnowledgeBaseFiles(1);
  };

  // Fetch knowledge base files with pagination
  const fetchKnowledgeBaseFiles = async (page: number = currentPage) => {
    try {
      const selectedKb = knowledgeBaseOptions.find(kb => kb.value === knowledgeBase);
      if (!selectedKb || !selectedKb.id) {
        return;
      }

      if (!userId) {
        console.error('userId 未设置');
        return;
      }
      
      const url = `/uploadFile/getUploadFileList?lagiUserId=${userId}&pageNumber=${page}&category=${knowledgeBase}&pageSize=${pageSize}&knowledgeBaseId=${selectedKb.id}`;
      
      const response = await fetch(url);
      
      if (response.status === 200) {
        const result = await response.json();
        if (result.data && Array.isArray(result.data)) {
          setKbFileList(result.data);
          setTotalPages(result.totalPage || 1);
          setCurrentPage(page);
        }
      } else {
        throw new Error('获取文件列表失败');
      }
    } catch (error) {
      console.error('获取知识库文件失败:', error);
      Toast.error('获取知识库文件失败');
    }
  };

  // Upload file to knowledge base
  const handleKbFileUpload = async (file: any) => {
    if (!knowledgeBase) {
      Toast.error('请先选择知识库');
      return;
    }

    if (!file) {
      Toast.error('请上传文件');
      return;
    }

    try {
      // Get current knowledge base info
      const selectedKb = knowledgeBaseOptions.find(kb => kb.value === knowledgeBase);
      if (!selectedKb) {
        Toast.error('知识库信息不存在');
        return;
      }

      if (!userId) {
        Toast.error('userId 未设置');
        return;
      }

      const knowledgeBaseId = selectedKb.id;
      
      const url = `/uploadFile/uploadLearningFile?category=${knowledgeBase}&userId=${userId}&knowledgeBaseId=${knowledgeBaseId}`;
      const formData = new FormData();
      formData.append('file', file);

      Toast.info('文件上传中...');
      
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`上传失败，状态码: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status && data.status === 'success') {
        Toast.success('文件上传成功！');
        // Refresh file list, go to first page
        fetchKnowledgeBaseFiles(1);
      } else {
        throw new Error('上传失败');
      }
    } catch (error) {
      console.error('上传文件失败:', error);
      const errorMessage = error instanceof Error ? error.message : '上传文件失败';
      Toast.error(errorMessage);
    }
  };

  // Fetch user info on mount
  useEffect(() => {
    fetchUserInfo();
  }, []);

  // Fetch knowledge base options on mount
  useEffect(() => {
    const fetchKnowledgeBases = async () => {
      if (!userId || !region) {
        return;
      }

      try {
        const response = await fetch(`/knowledge/getList?userId=${userId}&region=${region}`);
        if (response.ok) {
          const result = await response.json();
          if (result.data && Array.isArray(result.data)) {
            const options = [
              { value: '', label: '不使用知识库', id: '' },
              ...result.data.map((kb: any) => ({
                value: kb.category,
                label: kb.name,
                id: kb.id,
              }))
            ];
            setKnowledgeBaseOptions(options);
            setKnowledgeBase(''); // Set default to "不使用知识库"
          }
        }
      } catch (error) {
        console.error('获取知识库列表失败:', error);
        // Set default option even on error
        setKnowledgeBaseOptions([{ value: '', label: '不使用知识库', id: '' }]);
        setKnowledgeBase('');
      }
    };
    fetchKnowledgeBases();
  }, [userId, region]);


  // Initialize toolbar visibility and readonly state on mount based on lastActiveTab
  useEffect(() => {
    const isTextTab = lastActiveTab.current === 'text';
    setToolbarVisible(isTextTab);
    setIsCodeFlowMode(!isTextTab);
    clientContext.playground.config.readonly = !isTextTab;
  }, [setToolbarVisible, setIsCodeFlowMode, clientContext]);

  // Detect which tab's canvas is currently displayed when opening the side sheet
  useEffect(() => {
    if (visible) {
      // When opening, switch to the tab that matches the current canvas
      setActiveTab(lastActiveTab.current);
      // Set toolbar visibility, code flow mode, and readonly state based on the active tab
      const isTextTab = lastActiveTab.current === 'text';
      setToolbarVisible(isTextTab);
      setIsCodeFlowMode(!isTextTab);
      clientContext.playground.config.readonly = !isTextTab;
    }
    // Don't restore toolbar visibility when closing - keep based on canvas content
  }, [visible, setToolbarVisible, setIsCodeFlowMode, clientContext]);

  const handleTabChange = (key: string) => {
    if (key === 'code') {
      handleCodeTabChange();
      setToolbarVisible(false); // Hide toolbar when switching to code tab
      setIsCodeFlowMode(true); // Set code flow mode to hide variable panel
      clientContext.playground.config.readonly = true; // Set canvas to readonly for code flow
    } else if (key === 'text') {
      handleTextTabChange();
      setToolbarVisible(true); // Show toolbar when switching to text tab
      setIsCodeFlowMode(false); // Unset code flow mode to show variable panel
      clientContext.playground.config.readonly = false; // Set canvas to editable for text flow
    }
    setActiveTab(key);
    lastActiveTab.current = key; // Update which tab's canvas is displayed
  };

  const handleCodeTabChange = () => {
    // Save current text tab canvas data
    textCanvasData.current = clientContext.document.toJSON();
    
    // Clear all nodes
    const allNodes = clientContext.document.getAllNodes();
    allNodes.forEach((node) => {
      node.dispose();
    });
    
    // Restore code tab canvas data if exists, otherwise leave empty for first time
    if (!isFirstCodeTab.current && codeCanvasData.current) {
      clientContext.document.renderJSON(codeCanvasData.current);
    }
    
    isFirstCodeTab.current = false;
  };

  const handleTextTabChange = () => {
    // Save current code tab canvas data
    codeCanvasData.current = clientContext.document.toJSON();
    
    // Clear all nodes
    const allNodes = clientContext.document.getAllNodes();
    allNodes.forEach((node) => {
      node.dispose();
    });
    
    // Restore text tab canvas data
    if (textCanvasData.current) {
      clientContext.document.renderJSON(textCanvasData.current);
    }
  };

  const handleCodeGenerate = async () => {
    const currentFileList = currentConversation?.fileList || [];
    if (currentFileList.length === 0) {
      Toast.warning('请上传至少一个文件');
      return;
    }
    
    try {
      setLoading(true);
      const trimmedInput = codeInput.trim();
      const defaultMessage = '上传代码文件进行流程抽取';
      const messageContent = trimmedInput || defaultMessage;
      const pendingUserMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: messageContent,
        timestamp: Date.now()
      };
      const messageToSend = [
        ...(currentConversation?.codeMessages || []),
        pendingUserMessage
      ]
        .filter(message => message.role === 'user')
        .map(message => message.content)
        .filter(content => content !== defaultMessage);
      if (trimmedInput) {
        setCodeInput('');
      }
      // 先本地追加用户消息
      addUserMessage(messageContent, 'code');
      // 准备上传的文件数据
      const formData = new FormData();
      formData.append('knowledgeBase', knowledgeBase);
      formData.append('message', JSON.stringify(messageToSend));
      currentFileList.forEach((file) => {
        if (file.fileInstance) {
          formData.append('files', file.fileInstance);
        }
      });
      
      // 调用API
      const response = await fetch('/coding/code2FlowSchema', {
        method: 'POST',
        body: formData,
      });

      // 解析响应数据
      const result = await response.json();

      // 检查响应状态和返回的status字段
      if (!response.ok || result.status === 'failed') {
        const errorMessage = result.msg || '抽取流程失败';
        addAssistantMessage(`抽取流程失败：${errorMessage}`, 'code');
        return;
      }

      // 检查是否有返回的流程数据
      if (result.data) {
        // 解析流程数据（可能是字符串形式的 JSON）
        let flowData;
        if (typeof result.data === 'string') {
          flowData = JSON.parse(result.data);
        } else {
          flowData = result.data;
        }

        // 清空当前画布的所有节点
        const allNodes = clientContext.document.getAllNodes();
        allNodes.forEach((node) => {
          node.dispose();
        });

        // 渲染新的流程到画布
        clientContext.document.renderJSON(flowData);
        
        // 更新代码流程 tab 的画布数据
        codeCanvasData.current = flowData;
        
        // 设置画布为只读模式和代码流程模式
        clientContext.playground.config.readonly = true;
        setIsCodeFlowMode(true);
        
        // 自动布局
        await tools.autoLayout();
        
        // 添加助手消息到对话历史
        addAssistantMessage('抽取流程成功！', 'code');
        
        Toast.success('抽取流程成功');
      } else {
        throw new Error('API 未返回流程数据');
      }
    } catch (error) {
      console.error('抽取流程出错:', error);
      // 显示错误信息，如果是Error对象则显示其message
      const errorMessage = error instanceof Error ? error.message : '抽取流程失败，请重试';
      addAssistantMessage(`抽取流程失败：${errorMessage}`, 'code');
      Toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!input.trim()) {
      Toast.warning('请输入流程描述');
      return;
    }
  
    // 先保存输入内容，再清空输入框
    const currentInput = input.trim();
    try {
      setLoading(true);
      // 立即清空输入框
      setInput('');
      
      // 构造即将发送的用户消息与当前会话历史
      const pendingUserMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: currentInput,
        timestamp: Date.now()
      };
      const historyToSend = [...chatHistory, pendingUserMessage].map(m => ({ role: m.role, content: m.content }));
      // 先本地追加用户消息
      addUserMessage(currentInput, 'text');
      
      // 获取URL中的agentId参数
      const urlParams = new URLSearchParams(window.location.search);
      const agentId = urlParams.get('agentId');
      
      if (!agentId) {
        Toast.error('缺少agentId参数');
        setLoading(false);
        return;
      }

      // 获取当前对话的最新工作流json作为lastWorkFlow
      const lastWorkFlow = currentConversation?.workflow_json || null;
  
      // 调用API
      const response = await fetch('/workflow/txt2FlowSchema', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agentId,
          input: currentInput,
          history: historyToSend,
          flowDocList, // 新增
          lastWorkFlow // 传入最新生成的工作流json
        }),
      });
  
      // 解析响应数据
      const result = await response.json();
  
      // 检查响应状态和返回的status字段
      if (!response.ok || result.status === 'failed') {
        // 提取错误信息，如果有
        const errorMessage = result.message || '生成流程失败';
        throw new Error(errorMessage);
      }

      // 处理生成的流程数据
      if (result.data) {
        // 解析流程数据（可能是字符串形式的 JSON）
        let flowData;
      if (typeof result.data === 'string') {
        flowData = JSON.parse(result.data);
      } else {
          flowData = result.data;
      }
      // 清空当前画布的所有节点
      const allNodes = clientContext.document.getAllNodes();
      allNodes.forEach((node) => {
          node.dispose();
      });
      clientContext.document.renderJSON(flowData);
      textCanvasData.current = flowData;
      
      // 将生成的flowData保存到当前对话的workflow_json字段
      setConversations(prev => {
        const next = [...prev];
        const conv = { ...next[currentConversationIndex] };
        conv.workflow_json = flowData;
        next[currentConversationIndex] = conv;
        return next;
      });
      
      // 添加助手消息到对话历史
      addAssistantMessage('流程生成成功！', 'text');
      } else {
        throw new Error('API 未返回流程数据');
     }
      Toast.success('流程生成成功');
    } catch (error) {
      console.error('生成流程出错:', error);
      // 显示错误信息，如果是Error对象则显示其message
      const errorMessage = error instanceof Error ? error.message : '生成流程失败，请重试';
      Toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <SideSheet
      title=" "
      visible={visible}
      mask={false}
      onCancel={onCancel}
      headerStyle={{ minHeight: '0px', padding: '16px 16px 0' }}
    >
      <div style={{ padding: '0 16px', height: '100%', display: 'flex', flexDirection: 'column' }} >
        <Tabs 
          activeKey={activeTab} 
          onChange={handleTabChange}
          type="line"
          style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
          contentStyle={{ flex: 1, display: 'flex', minHeight: 0 }}
        >
          <TabPane tab="生成流程" itemKey="text" style={{  height: '100%' }} >
            <div  style={{ display: 'flex', flexDirection: 'column', height: '100%', flex: 1, minHeight: 0 }}>
              {/* 顶部工具栏：历史对话选择与新对话 */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '8px', gap: '8px' }}>
                <Dropdown
                  trigger={'click'}
                  position={'bottomRight'}
                  render={
                    <Dropdown.Menu>
                      {conversations.map((c, idx) => (
                        <Dropdown.Item
                          key={c.id}
                          onClick={() => setCurrentConversationIndex(idx)}
                          selected={idx === currentConversationIndex}
                        >
                          {c.title}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  }
                >
                  <Button size="small" icon={<IconHistory />} aria-label="历史对话" />
                </Dropdown>
                <Button size="small" icon={<IconPlus />} aria-label="新对话" onClick={handleNewConversation} />
              </div>

              {/* 对话历史区域：仅在有消息时显示 */}
              {chatHistory.length > 0 && (
                <div
                  ref={chatScrollRef}
                  style={{
                    height: '400px',
                    flex: '0 0 auto',
                    overflowY: 'auto',
                    padding: '12px 0',
                    marginBottom: '16px',
                    border: '1px solid #e8e8e8',
                    borderRadius: '8px',
                    backgroundColor: '#fafafa',
                  }}
                >
                  {chatHistory.map((message) => (
                    <div
                      key={message.id}
                      style={{
                        marginBottom: '12px',
                        padding: '0 16px',
                        display: 'flex',
                        flexDirection: message.role === 'user' ? 'row-reverse' : 'row',
                        alignItems: 'flex-start'
                      }}
                    >
                      <div
                        style={{
                          maxWidth: '80%',
                          padding: '8px 12px',
                          borderRadius: '12px',
                          backgroundColor: message.role === 'user' ? 'rgba(77, 83, 232, 1)' : '#fff',
                          color: message.role === 'user' ? '#fff' : '#333',
                          fontSize: '14px',
                          lineHeight: '1.4',
                          wordBreak: 'break-word',
                          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                        }}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* 文件展示区域 */}
              {flowDocList.length > 0 && (
                <div style={{display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8, flexWrap: 'wrap'}}>
                  {flowDocList.map((file, idx) => (
                    <div key={file.filepath || idx} style={{display:'flex',alignItems:'center',padding: '2px 8px',background:'#f3f4f6',borderRadius:12,marginRight: 8,height:26}}>
                      <span style={{maxWidth:120,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',fontSize:14}} title={file.filename}>{file.filename}</span>
                      <span onClick={() => {
                        const currentIdx = currentConversationIndexRef.current;
                        setConversations(prev => {
                          const next = [...prev];
                          const conv = { ...next[currentIdx] };
                          conv.flowDocList = conv.flowDocList.filter((_, i) => i !== idx);
                          next[currentIdx] = conv;
                          return next;
                        });
                      }} style={{marginLeft:6,fontSize:14,cursor:'pointer',color:'#888'}}>&times;</span>
                    </div>
                  ))}
                </div>
              )}
              
              {/* 输入区域 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ position: 'relative' }}>
                  <TextArea
                    placeholder="请输入流程描述，例如：生成一个带知识库问答的工作流..."
                    style={{ minHeight: '120px', maxHeight: '150px', paddingBottom: 32 }}
                    value={input}
                    onChange={handleInputChange}
                    autoFocus={activeTab === 'text'}
                    disabled={loading}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                        e.preventDefault();
                        handleGenerate();
                      }
                    }}
                  />
                  {/* 右下角悬浮按钮：仅叠加在底部，不压缩输入内容宽度 */}
                  <div style={{ position: 'absolute', right: 40, bottom: 8, display: 'flex', gap: 8 }}>
                    <Upload
                      accept='.pdf,.doc,.docx,.txt,.md,.json'
                      showUploadList={false}
                      customRequest={async ({file}) => {
                        const formData = new FormData();
                        if (file.fileInstance) {
                          formData.append('file', file.fileInstance);
                        } else {
                          Toast.error('文件无效，无法上传');
                          return;
                        }
                        const resp = await fetch('/workflow/uploadDoc', { method: 'POST', body: formData });
                        const result = await resp.json();
                        if(result.code === 0 && Array.isArray(result.data)) {
                          const currentIdx = currentConversationIndexRef.current;
                          setConversations(prev => {
                            const next = [...prev];
                            const conv = { ...next[currentIdx] };
                            conv.flowDocList = [...conv.flowDocList, ...result.data];
                            next[currentIdx] = conv;
                            return next;
                          });
                          Toast.success('上传成功');
                        } else {
                          Toast.error(result.message || '上传失败');
                        }
                      }}
                    >
                      <Button icon={<IconUpload />} size='small' aria-label='上传文档' style={{borderRadius: '50%',width:24,height:24}} />
                    </Upload>
                  </div>
                  <div style={{ position: 'absolute', right: 8, bottom: 8 }}>
                    <Button
                      onClick={handleGenerate}
                      disabled={loading}
                      icon={loading ? <IconSpin spin /> : <IconSend />}
                      theme="solid"
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        backgroundColor: 'rgba(77, 83, 232, 1)'
                      }}
                      aria-label="生成流程"
                    />
                  </div>
                </div>
                <div style={{ fontSize: 12, color: '#666' }}>
                  提示：详细描述流程步骤和逻辑，将获得更精准的生成结果
                </div>
              </div>
            </div>
          </TabPane>
          <TabPane tab="抽取流程" itemKey="code">
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', flex: 1, minHeight: 0 }}>
              {/* 顶部工具栏：历史对话选择与新对话 */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '8px', gap: '8px' }}>
                <Dropdown
                  trigger={'click'}
                  position={'bottomRight'}
                  render={
                    <Dropdown.Menu>
                      {conversations.map((c, idx) => (
                        <Dropdown.Item
                          key={c.id}
                          onClick={() => setCurrentConversationIndex(idx)}
                          selected={idx === currentConversationIndex}
                        >
                          {c.title}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  }
                >
                  <Button size="small" icon={<IconHistory />} aria-label="历史对话" />
                </Dropdown>
                <Button size="small" icon={<IconPlus />} aria-label="新对话" onClick={handleNewConversation} />
              </div>

              {/* 对话历史区域：仅在有消息时显示 */}
              {chatHistory.length > 0 && (
                <div
                  ref={chatScrollRef}
                  style={{
                    flex: 1,
                    minHeight: '360px',
                    maxHeight: '400px',
                    overflowY: 'auto',
                    padding: '12px 0',
                    marginBottom: '16px',
                    border: '1px solid #e8e8e8',
                    borderRadius: '8px',
                    backgroundColor: '#fafafa',
                    
                  }}
                >
                  {chatHistory.map((message) => (
                    <div
                      key={message.id}
                      style={{
                        marginBottom: '12px',
                        padding: '0 16px',
                        display: 'flex',
                        flexDirection: message.role === 'user' ? 'row-reverse' : 'row',
                        alignItems: 'flex-start'
                      }}
                    >
                      <div
                        style={{
                          maxWidth: '80%',
                          padding: '8px 12px',
                          borderRadius: '12px',
                          backgroundColor: message.role === 'user' ? 'rgba(77, 83, 232, 1)' : '#fff',
                          color: message.role === 'user' ? '#fff' : '#333',
                          fontSize: '14px',
                          lineHeight: '1.4',
                          wordBreak: 'break-word',
                          whiteSpace: 'pre-wrap',
                          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                        }}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 上传文件信息提示 */}
              {fileList.length > 0 && (
                <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Tooltip
                    position="topRight"
                    trigger="hover"
                    content={
                      <div
                        style={{
                          maxWidth: 260,
                          maxHeight: 200,
                          overflowY: 'auto',
                          paddingRight: 4,
                          scrollbarWidth: 'thin',
                          scrollbarColor: 'rgba(77, 83, 232, 0.85) transparent'
                        }}
                      >
                        {fileList.map((file, idx) => {
                          const fileName = file.name || file.fileInstance?.name || file.url || `文件${idx + 1}`;
                          return (
                            <div
                              key={file.uid || fileName || idx}
                              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6, gap: 8 }}
                            >
                              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={fileName}>
                                {fileName}
                              </span>
                              <span
                                onClick={() => {
                                  const currentIdx = currentConversationIndexRef.current;
                                  setConversations(prev => {
                                    const next = [...prev];
                                    const conv = { ...next[currentIdx] };
                                    conv.fileList = conv.fileList.filter((_, fileIdx) => fileIdx !== idx);
                                    next[currentIdx] = conv;
                                    return next;
                                  });
                                }}
                                style={{ cursor: 'pointer', color: '#888', fontSize: 14 }}
                              >
                                &times;
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    }
                  >
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        fontSize: 13,
                        color: '#4d53e8',
                        backgroundColor: 'rgba(77, 83, 232, 0.08)',
                        borderRadius: 16,
                        padding: '4px 12px',
                        cursor: 'pointer'
                      }}
                    >
                      已选择代码文件 {fileList.length} 个
                    </span>
                  </Tooltip>
                </div>
              )}


              {/* 输入区域 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: 'auto' }}>
                <div style={{ position: 'relative' }}>
                  <TextArea
                    placeholder="请输入代码描述或上传代码文件..."
                    style={{ minHeight: '120px', maxHeight: '150px', paddingBottom: 32 }}
                    value={codeInput}
                    onChange={(value) => setCodeInput(value)}
                    autoFocus={activeTab === 'code'}
                    disabled={loading}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                        e.preventDefault();
                        handleCodeGenerate();
                      }
                    }}
                  />
                  {/* 右下角悬浮按钮：仅叠加在底部，不压缩输入内容宽度 */}
                  <div style={{ position: 'absolute', right: 8, bottom: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
                    {/* 知识库选择按钮 */}
                    <Dropdown
                      trigger={'click'}
                      position={'topRight'}
                      render={
                        <Dropdown.Menu>
                          {knowledgeBaseOptions.map((option) => (
                            <Dropdown.Item
                              key={option.value || 'empty'}
                              onClick={() => setKnowledgeBase(option.value)}
                              selected={knowledgeBase === option.value}
                            >
                              {option.label}
                            </Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      }
                    >
                      <Button 
                        size='small' 
                        aria-label='选择知识库'
                        style={{
                          borderRadius: '50%',
                          width: 24,
                          height: 24,
                          fontSize: '12px',
                          padding: 0
                        }}
                      >
                        KB
                      </Button>
                    </Dropdown>
                    
                    {/* 编辑知识库按钮（仅在选择知识库后显示） */}
                    {knowledgeBase && (
                      <Tooltip
                        position="topRight"
                        content={
                          knowledgeBaseOptions.find(option => option.value === knowledgeBase)?.label || '编辑已选知识库'
                        }
                      >
                        <Button
                          icon={<IconEdit />}
                          onClick={handleEditKnowledgeBase}
                          size='small'
                          aria-label='编辑知识库'
                          style={{
                            borderRadius: '50%',
                            width: 24,
                            height: 24
                          }}
                        />
                      </Tooltip>
                    )}
                    
                    {/* 上传代码按钮 */}
                    <Upload
                      multiple
                      fileList={[]}
                      onChange={handleFileChange}
                      beforeUpload={() => false}
                      accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.h,.hpp,.cs,.php,.rb,.go,.rs,.swift,.kt,.scala,.js,.jsx,.sh,.bash,.bat,.yml,.yaml,.json,.xml,.html,.css,.vue,.jsx,.tsx,.sql,.md,.txt"
                      showUploadList={false}
                    >
                      <Button icon={<IconUpload />} size='small' aria-label='上传代码' style={{borderRadius: '50%',width:24,height:24}} />
                    </Upload>
                    
                    {/* 抽取流程按钮 */}
                    <Button
                      onClick={handleCodeGenerate}
                      disabled={loading}
                      icon={loading ? <IconSpin spin /> : <IconSend />}
                      theme="solid"
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        backgroundColor: 'rgba(77, 83, 232, 1)'
                      }}
                      aria-label="抽取流程"
                    />
                  </div>
                </div>
                <div style={{ fontSize: 12, color: '#666' }}>
                  提示：上传代码文件，选择知识库后抽取代码流程
                </div>
              </div>
            </div>
          </TabPane>
        </Tabs>
      </div>
    </SideSheet>

    {/* Knowledge Base Management Modal */}
    <Modal
      title="管理知识库文件"
      visible={kbModalVisible}
      onCancel={() => setKbModalVisible(false)}
      footer={null}
      width={600}
      style={{ maxHeight: '80vh' }}
      headerStyle={{ padding: '12px 16px' }}
      bodyStyle={{ padding: '0 0 16px 0' }}
    >
      <div>
        {/* Header with knowledge base name and upload button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 14, color: '#666' }}>
            知识库：{knowledgeBaseOptions.find(kb => kb.value === knowledgeBase)?.label || ''}
          </div>
          <Upload
            customRequest={({ file }) => {
              handleKbFileUpload(file.fileInstance);
            }}
            accept=".pdf,.doc,.docx,.txt"
            showUploadList={false}
          >
            <Button
              icon={<IconUpload />}
              size="small"
              style={{
                backgroundColor: 'rgba(77, 83, 232, 0.1)',
                borderRadius: '4px',
                color: 'rgba(77, 83, 232, 1)',
              }}
            >
              上传文件
            </Button>
          </Upload>
        </div>

        {kbFileList.length > 0 ? (
          <div style={{ height: '280px', overflowY: 'auto' }}>
            {kbFileList.map((file: any, index: number) => (
              <div
                key={file.fileId || index}
                style={{
                  padding: '12px',
                  marginBottom: '8px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '4px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{file.filename || file.fileName}</div>
                </div>
                <Button
                  type="danger"
                  size="small"
                  onClick={async () => {
                    try {
                      const response = await fetch(`/uploadFile/deleteFile?category=${knowledgeBase}`, {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify([file.fileId]),
                      });
                      
                      const result = await response.json();
                      
                      if (response.ok && result.status === 'success') {
                        Toast.success('文件删除成功');
                        // Refresh current page
                        fetchKnowledgeBaseFiles(currentPage);
                      } else {
                        throw new Error(result.message || '删除失败');
                      }
                    } catch (error) {
                      console.error('删除文件失败:', error);
                      const errorMessage = error instanceof Error ? error.message : '文件删除失败';
                      Toast.error(errorMessage);
                    }
                  }}
                >
                  删除
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
            该知识库暂无文件
          </div>
        )}
        
        {/* Pagination */}
        {kbFileList.length > 0 && totalPages > 1 && (
          <div style={{ marginTop: 8, display: 'flex', justifyContent: 'center' }}>
            <Pagination
              currentPage={currentPage}
              total={totalPages * pageSize}
              pageSize={pageSize}
              onChange={(page) => fetchKnowledgeBaseFiles(page)}
              showSizeChanger={false}
            />
          </div>
        )}
      </div>
    </Modal>
    </>
  );
};
