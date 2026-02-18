import React, { useState, useEffect } from 'react';

const OAB_MAP = {
  'SP': 'OAB/SP 476.963',
  'RS': 'OAB/RS 107.048',
  'DF': 'OAB/DF 75.394',
  'AM': 'OAB/AM 8.894',
  'default': 'OAB/SP 476.963'
};

export default function OABDetector() {
  const [oab, setOab] = useState(OAB_MAP.default);

  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        const region = data.region_code;
        setOab(OAB_MAP[region] || OAB_MAP.default);
      })
      .catch(() => setOab(OAB_MAP.default));
  }, []);

  return <span className="font-semibold">{oab}</span>;
}