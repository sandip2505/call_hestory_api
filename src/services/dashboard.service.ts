import { Call } from '../models/Call.js';
import { Recording } from '../models/Recording.js';
import { Device } from '../models/Device.js';
import { Location } from '../models/Location.js';

export const getDashboardSummary = async () => {
  const [totalCalls, callTypeStats, recordingStats, durationStats] = await Promise.all([
    Call.countDocuments(),
    Call.aggregate([
      { $group: { _id: '$callType', count: { $sum: 1 } } }
    ]),
    Call.aggregate([
      { $match: { recordingAvailable: true } },
      { $count: 'count' }
    ]),
    Call.aggregate([
      { $group: { _id: null, totalDuration: { $sum: '$duration' } } }
    ])
  ]);

  const summary = {
    totalCalls,
    incoming: 0,
    outgoing: 0,
    missed: 0,
    rejected: 0,
    totalRecordings: recordingStats[0]?.count || 0,
    totalDuration: durationStats[0]?.totalDuration || 0,
  };

  callTypeStats.forEach((stat) => {
    if (stat._id in summary) {
      (summary as any)[stat._id] = stat.count;
    }
  });

  return summary;
};

export const getDailyCalls = async (days = 30) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return Call.aggregate([
    { $match: { timestamp: { $gte: startDate } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
        count: { $sum: 1 },
      }
    },
    { $sort: { _id: 1 } }
  ]);
};

export const getTopContacts = async (limit = 10) => {
  return Call.aggregate([
    { $match: { contactName: { $exists: true, $ne: '' } } },
    {
      $group: {
        _id: '$normalizedPhoneNumber',
        contactName: { $first: '$contactName' },
        count: { $sum: 1 },
        duration: { $sum: '$duration' }
      }
    },
    { $sort: { count: -1 } },
    { $limit: limit }
  ]);
};

export const wipeAllData = async () => {
  await Promise.all([
    Call.deleteMany({}),
    Recording.deleteMany({}),
    Device.deleteMany({}),
    Location.deleteMany({})
  ]);
};
