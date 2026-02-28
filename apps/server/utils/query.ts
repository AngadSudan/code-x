export const publicProfile = `
        query userPublicProfile($username: String!) {
        matchedUser(username: $username) {
            contestBadge {
                name
                expired
                hoverText
                icon
            }
            username
                profile {
                ranking
                userAvatar
                realName
                aboutMe
                school
                skillTags
                postViewCount
                postViewCountDiff
                reputation
                reputationDiff
                categoryDiscussCountDiff
                certificationLevel
            }
        }
        }
    `;
export const questionProfile = `
        query languageStats($username: String!) {
            matchedUser(username: $username) {
                languageProblemCount {
                languageName
                problemsSolved
                }
            }
        }
    `;
export const userContestRating = `
        query userContestRankingInfo($username: String!) {
            userContestRanking(username: $username) {
                attendedContestsCount
                rating
                globalRanking
                totalParticipants
                topPercentage
                badge {
                name
                }
            }
            userContestRankingHistory(username: $username) {
                attended
                trendDirection
                problemsSolved
                totalProblems
                finishTimeInSeconds
                rating
                ranking
                contest {
                title
                startTime
                }
            }
        }
    `;
export const Badges = `
        query userBadges($username: String!) {
            matchedUser(username: $username) {
                badges {
                id
                name
                shortName
                displayName
                icon
                hoverText
                medal {
                    slug
                    config {
                    iconGif
                    iconGifBackground
                    }
                }
                creationDate
                category
                }
                upcomingBadges {
                name
                icon
                progress
                }
            }
        }
    `;
export const profileCalender = `
        query userProfileCalendar($username: String!, $year: Int) {
            matchedUser(username: $username) {
                userCalendar(year: $year) {
                activeYears
                streak
                totalActiveDays
                dccBadges {
                    timestamp
                    badge {
                    name
                    icon
                    }
                }
                submissionCalendar
                }
            }
        }
    `;
