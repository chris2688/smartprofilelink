class SnsAccount {
  final String id;
  final String platform;
  final String accountName;
  final String profileImage;
  final int followers;
  final double engagementRate;
  final int avgLikes;
  final int avgComments;
  final int avgViews;
  final DateTime connectedAt;

  SnsAccount({
    required this.id,
    required this.platform,
    required this.accountName,
    required this.profileImage,
    required this.followers,
    required this.engagementRate,
    required this.avgLikes,
    required this.avgComments,
    required this.avgViews,
    required this.connectedAt,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'platform': platform,
        'accountName': accountName,
        'profileImage': profileImage,
        'followers': followers,
        'engagementRate': engagementRate,
        'avgLikes': avgLikes,
        'avgComments': avgComments,
        'avgViews': avgViews,
        'connectedAt': connectedAt.toIso8601String(),
      };

  factory SnsAccount.fromJson(Map<String, dynamic> json) => SnsAccount(
        id: json['id'],
        platform: json['platform'],
        accountName: json['accountName'],
        profileImage: json['profileImage'],
        followers: json['followers'],
        engagementRate: json['engagementRate'],
        avgLikes: json['avgLikes'],
        avgComments: json['avgComments'],
        avgViews: json['avgViews'],
        connectedAt: DateTime.parse(json['connectedAt']),
      );
}

