import './ProgressBar.css';

export default function ProgressBar({ current, total }) {
    const percentage = ((current + 1) / total) * 100;

    return (
        <div className="progress-wrapper">
            <div className="progress-info">
                <span className="progress-label">
                    Question <strong>{current + 1}</strong> of <strong>{total}</strong>
                </span>
                <span className="progress-percent">{Math.round(percentage)}%</span>
            </div>
            <div className="progress-track">
                <div
                    className="progress-fill"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}
