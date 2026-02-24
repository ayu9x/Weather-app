import React from 'react';

const LoadingSkeleton = () => (
  <div className="loading-skeleton">
    {/* Current weather skeleton */}
    <div className="skeleton-card main-skeleton">
      <div className="skeleton-line skeleton-title" />
      <div className="skeleton-circle" />
      <div className="skeleton-line skeleton-temp" />
      <div className="skeleton-line skeleton-desc" />
    </div>

    {/* Details skeleton */}
    <div className="skeleton-card details-skeleton">
      <div className="skeleton-grid">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="skeleton-detail">
            <div className="skeleton-line skeleton-small" />
            <div className="skeleton-line skeleton-small" />
          </div>
        ))}
      </div>
    </div>

    {/* Forecast skeleton */}
    <div className="skeleton-card forecast-skeleton">
      <div className="skeleton-line skeleton-title" />
      {[...Array(5)].map((_, i) => (
        <div key={i} className="skeleton-line skeleton-row" />
      ))}
    </div>
  </div>
);

export default LoadingSkeleton;
