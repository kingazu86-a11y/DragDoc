/**
 * DragDocs Unified Office Productivity Suite
 * Complete professional all-in-one desktop productivity platform comparable to Microsoft Office.
 * WORD — Multi-page document processor with 11-tab ribbon & pagination.
 * SHEETS — Advanced spreadsheet creation with formula engine & cell formatting.
 * SLIDES — Professional presentation creation with 16:9 canvas & slideshow player.
 * PDF STUDIO — Multi-page PDF viewing, annotations, form filling & digital signatures.
 * UNIFIED OFFICE HOME — Launcher dashboard, multi-document tabs & file management.
 */

import React from 'react';
import { OfficeSuiteProvider } from './context/OfficeSuiteContext';
import { OfficeSuiteShell } from './components/shell/OfficeSuiteShell';

import { DocumentProvider, useDocument } from './context/DocumentContext';
import { PresentationProvider } from './context/PresentationContext';

// Word Processor Components
import { TitleBar } from './components/shell/TitleBar';
import { Ribbon } from './components/shell/Ribbon';
import { StatusBar } from './components/shell/StatusBar';
import { DocumentCanvas } from './components/canvas/DocumentCanvas';
import { FileBackstage } from './components/backstage/FileBackstage';
import { DialogsContainer } from './components/dialogs/DialogsContainer';
import { NavigationSidebar } from './components/sidebar/NavigationSidebar';
import { ProofingSidebar } from './components/sidebar/ProofingSidebar';
import { AiAssistantSidebar } from './components/sidebar/AiAssistantSidebar';
import { CommentsSidebar } from './components/sidebar/CommentsSidebar';
import { FindReplaceSidebar } from './components/sidebar/FindReplaceSidebar';
import { MailingsSidebar } from './components/sidebar/MailingsSidebar';

// Presentation Components
import { TitleBarPresentation } from './components/presentation/TitleBarPresentation';
import { RibbonPresentation } from './components/presentation/RibbonPresentation';
import { SlideNavigationPanel } from './components/presentation/SlideNavigationPanel';
import { SlideCanvas } from './components/presentation/SlideCanvas';
import { FormatInspector } from './components/presentation/FormatInspector';
import { StatusBarPresentation } from './components/presentation/StatusBarPresentation';
import { SlideShowPlayer } from './components/presentation/SlideShowPlayer';
import { ChartDataEditorModal } from './components/dialogs/ChartDataEditorModal';

import './styles/app.css';

  export function WordProcessorApp({ onSwitchMode }) {
    const { darkTheme, isFullScreen } = useDocument();

    return (
      <div className={`dragdocs-app-container ${darkTheme ? 'dark-theme' : ''} ${isFullScreen ? 'fullscreen-mode' : ''}`}>
        <TitleBar />
        <Ribbon />
        <div className="dragdocs-main-workspace">
          <NavigationSidebar />
          <DocumentCanvas />
          <ProofingSidebar />
          <AiAssistantSidebar />
          <CommentsSidebar />
          <FindReplaceSidebar />
          <MailingsSidebar />
        </div>
        <StatusBar />
        <FileBackstage />
        <DialogsContainer />
      </div>
    );
  }

    export function PresentationApp({ onSwitchMode }) {
      return (
        <PresentationProvider>
          <div className="dragdocs-app-container">
            <TitleBarPresentation onSwitchMode={onSwitchMode} />
            <RibbonPresentation />
            <div className="dragdocs-main-workspace">
              <SlideNavigationPanel />
              <SlideCanvas />
              <FormatInspector />
            </div>
            <StatusBarPresentation />
            <SlideShowPlayer />
            <ChartDataEditorModal />
          </div>
        </PresentationProvider>
      );
    }

    function App() {
      return (
        < OfficeSuiteProvider >
        <OfficeSuiteShell
          renderWordApp={() => (
            <DocumentProvider>
              <WordProcessorApp />
            </DocumentProvider>
          )}
          renderSlidesApp={() => (
            <PresentationApp />
          )}
        />
    </OfficeSuiteProvider >
  );
    }

    export default App;
