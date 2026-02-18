import React from 'react';
import HelpdeskErrorFallback from './errors/HelpdeskErrorFallback';

export default class HelpdeskErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Helpdesk Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <HelpdeskErrorFallback 
          error={this.state.error}
          resetErrorBoundary={() => this.setState({ hasError: false, error: null })}
        />
      );
    }

    return this.props.children;
  }
}