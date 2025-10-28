import { FC, useState, useRef, useEffect, useContext } from 'react';
import { SideSheet, Button, TextArea, Toast, Tabs, TabPane, Dropdown } from '@douyinfe/semi-ui';
import { IconSpin, IconSend, IconPlus, IconHistory } from '@douyinfe/semi-icons';
import { useClientContext } from '@flowgram.ai/free-layout-editor';
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
  messages: ChatMessage[];
}

export const FlowGenSideSheet: FC<FlowGenSideSheetProps> = ({ visible, onCancel }) => {
  const [input, setInput] = useState<string>('');
  const [codeInput, setCodeInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('text');
  const [conversations, setConversations] = useState<Conversation[]>([{
    id: `conv-${Date.now()}`,
    title: '对话 1',
    messages: []
  }]);
  const [currentConversationIndex, setCurrentConversationIndex] = useState<number>(0);
  const clientContext = useClientContext();
  const { setToolbarVisible } = useContext(ToolbarContext);
  // Separate canvas data for each tab
  const textCanvasData = useRef<any>(null);
  const codeCanvasData = useRef<any>(null);
  const isFirstCodeTab = useRef<boolean>(true);
  const lastActiveTab = useRef<string>('text'); // Track which tab's canvas is currently displayed
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const currentConversation = conversations[currentConversationIndex];
  const chatHistory = currentConversation?.messages || [];

  // 确保事件处理函数正确处理输入
  const handleInputChange = (value: string) => {
    // 直接接收Semi UI TextArea组件传递的value
    setInput(value);
  };

  const handleCodeInputChange = (value: string) => {
    setCodeInput(value);
  };

  // 添加用户消息到当前会话
  const addUserMessage = (content: string) => {
    const newMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: Date.now()
    };
    setConversations(prev => {
      const next = [...prev];
      const conv = { ...next[currentConversationIndex] };
      conv.messages = [...conv.messages, newMessage];
      next[currentConversationIndex] = conv;
      return next;
    });
  };

  // 添加助手消息到当前会话
  const addAssistantMessage = (content: string) => {
    const newMessage: ChatMessage = {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      content: content.trim(),
      timestamp: Date.now()
    };
    setConversations(prev => {
      const next = [...prev];
      const conv = { ...next[currentConversationIndex] };
      conv.messages = [...conv.messages, newMessage];
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
    setConversations(prev => {
      const idx = prev.length + 1;
      return [...prev, { id: `conv-${Date.now()}`, title: `对话 ${idx}`, messages: [] }];
    });
    setCurrentConversationIndex(conversations.length);
    setInput('');
  };

  // Initialize toolbar visibility and readonly state on mount based on lastActiveTab
  useEffect(() => {
    const isTextTab = lastActiveTab.current === 'text';
    setToolbarVisible(isTextTab);
    clientContext.playground.config.readonly = !isTextTab;
  }, [setToolbarVisible, clientContext]);

  // Detect which tab's canvas is currently displayed when opening the side sheet
  useEffect(() => {
    if (visible) {
      // When opening, switch to the tab that matches the current canvas
      setActiveTab(lastActiveTab.current);
      // Set toolbar visibility and readonly state based on the active tab
      const isTextTab = lastActiveTab.current === 'text';
      setToolbarVisible(isTextTab);
      clientContext.playground.config.readonly = !isTextTab;
    }
    // Don't restore toolbar visibility when closing - keep based on canvas content
  }, [visible, setToolbarVisible, clientContext]);

  const handleTabChange = (key: string) => {
    if (key === 'code') {
      handleCodeTabChange();
      setToolbarVisible(false); // Hide toolbar when switching to code tab
      clientContext.playground.config.readonly = true; // Set canvas to readonly for code flow
    } else if (key === 'text') {
      handleTextTabChange();
      setToolbarVisible(true); // Show toolbar when switching to text tab
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
    if (!codeInput.trim()) {
      Toast.warning('请输入代码');
      return;
    }
    
    try {
      setLoading(true);
      
      // 获取URL中的agentId参数
      const urlParams = new URLSearchParams(window.location.search);
      const agentId = urlParams.get('agentId');
      
      if (!agentId) {
        Toast.error('缺少agentId参数');
        setLoading(false);
        return;
      }
      
      // 调用API
      const response = await fetch('/coding/code2FlowSchema', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agentId,
          input: codeInput.trim()
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
        
        // 设置画布为只读模式
        clientContext.playground.config.readonly = true;
        
        Toast.success('代码流程生成成功');
      } else {
        throw new Error('API 未返回流程数据');
      }
    } catch (error) {
      console.error('生成代码流程出错:', error);
      // 显示错误信息，如果是Error对象则显示其message
      const errorMessage = error instanceof Error ? error.message : '生成代码流程失败，请重试';
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
  
    try {
      setLoading(true);
      // 构造即将发送的用户消息与当前会话历史
      const pendingUserMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: input.trim(),
        timestamp: Date.now()
      };
      const historyToSend = [...chatHistory, pendingUserMessage].map(m => ({ role: m.role, content: m.content }));
      // 先本地追加用户消息
      addUserMessage(input);
      
      // 获取URL中的agentId参数
      const urlParams = new URLSearchParams(window.location.search);
      const agentId = urlParams.get('agentId');
      
      if (!agentId) {
        Toast.error('缺少agentId参数');
        setLoading(false);
        return;
      }
  
      // 调用API
      const response = await fetch('/workflow/txt2FlowSchema', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agentId,
          input: input.trim(),
          history: historyToSend
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
      
      // 添加助手消息到对话历史
      addAssistantMessage('流程生成成功！');
      
      // 清空输入框
      setInput('');
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
                    flex: 1,
                    minHeight: '360px',
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
              
              {/* 输入区域 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ position: 'relative' }}>
                  <TextArea
                    placeholder="请输入流程描述，例如：生成一个带知识库问答的工作流..."
                    style={{ minHeight: '120px', maxHeight: '200px', paddingBottom: 32 }}
                    value={input}
                    onChange={handleInputChange}
                    autoFocus={activeTab === 'text'}
                    disabled={false}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                        e.preventDefault();
                        handleGenerate();
                      }
                    }}
                  />
                  {/* 右下角悬浮按钮：仅叠加在底部，不压缩输入内容宽度 */}
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
          
          <TabPane tab="代码流程" itemKey="code" style={{ height: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', flex: 1, minHeight: 0 }}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  fontSize: '15px',
                  fontWeight: '500',
                  marginBottom: '10px',
                  color: '#333',
                }}
              >
                代码输入
              </div>
              <TextArea
                placeholder="请输入代码，例如：Python代码或伪代码..."
                style={{ height: 200, marginBottom: 16 }}
                value={codeInput}
                onChange={handleCodeInputChange}
                autoFocus={activeTab === 'code'}
                disabled={false}
              />
              <div style={{ fontSize: 12, color: '#666', marginBottom: 16 }}>
                提示：输入代码片段，系统将自动转换为工作流
              </div>
              <Button
                onClick={handleCodeGenerate}
                loading={loading}
                icon={loading ? <IconSpin spin size="small" /> : null}
                style={{
                  backgroundColor: 'rgba(77, 83, 232, 1)',
                  borderRadius: '8px',
                  color: '#fff',
                  width: '100%',
                  height: '40px',
                }}
              >
                生成代码流程
              </Button>
            </div>
          </TabPane>
        </Tabs>
      </div>
    </SideSheet>
  );
};
